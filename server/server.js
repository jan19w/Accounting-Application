// server/server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL连接
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // 请根据实际情况修改
    password: 'sql2008', // 请根据实际情况修改
    database: 'projectdata'
});

// 检查连接
db.connect((err) => {
    if (err) {
        console.error('数据库连接失败:', err);
        return;
    }
    console.log('数据库连接成功！');
});

// 定义API路由

// 1. 查询所有记录（GET）
app.get('/api/details', (req, res) => {
    db.query('SELECT id, type, category, amount, DATE_FORMAT(date, "%Y-%m-%d") as date, note, created_at, updated_at FROM details ORDER BY date DESC, created_at DESC', (err, results) => {
        if (err) {
            console.error('查询失败:', err);
            return res.status(500).json({ error: '查询数据失败', details: err.message });
        }
        res.json(results);
    });
});

// 2. 新增记录（POST）
app.post('/api/details', (req, res) => {
    const { id, type, category, amount, date, note } = req.body;
    
    // 验证必填字段
    if (!id || !type || !category || !amount || !date) {
        return res.status(400).json({ error: '缺少必填字段' });
    }
    
    const sql = 'INSERT INTO details (id, type, category, amount, date, note) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [id, type, category, amount, date, note || ''];
    
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('新增失败:', err);
            return res.status(500).json({ error: '新增数据失败', details: err.message });
        }
        res.status(201).json({ message: '新增成功', id, insertId: result.insertId });
    });
});

// 3. 更新记录（PUT）
app.put('/api/details/:id', (req, res) => {
    const { id } = req.params;
    const { type, category, amount, date, note } = req.body;
    
    // 验证必填字段
    if (!type || !category || !amount || !date) {
        return res.status(400).json({ error: '缺少必填字段' });
    }
    
    const sql = 'UPDATE details SET type = ?, category = ?, amount = ?, date = ?, note = ? WHERE id = ?';
    const values = [type, category, amount, date, note || '', id];
    
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('更新失败:', err);
            return res.status(500).json({ error: '更新数据失败', details: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: '记录不存在' });
        }
        res.json({ message: '更新成功', id });
    });
});

// 4. 删除记录（DELETE）
app.delete('/api/details/:id', (req, res) => {
    const { id } = req.params;
    
    const sql = 'DELETE FROM details WHERE id = ?';
    
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('删除失败:', err);
            return res.status(500).json({ error: '删除数据失败', details: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: '记录不存在' });
        }
        res.json({ message: '删除成功', id });
    });
});

// 5. 批量删除（DELETE ALL）
app.delete('/api/details', (req, res) => {
    const sql = 'DELETE FROM details';
    
    db.query(sql, (err, result) => {
        if (err) {
            console.error('批量删除失败:', err);
            return res.status(500).json({ error: '批量删除失败', details: err.message });
        }
        res.json({ message: '所有数据已清空', deletedCount: result.affectedRows });
    });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器正在运行在 http://localhost:${PORT}`);
});