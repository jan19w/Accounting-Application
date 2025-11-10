import React, { useMemo, useState, useEffect } from 'react';
import KpiCards from './components/KpiCards.jsx';
import Charts from './components/Charts.jsx';
import Filters from './components/Filters.jsx';
import TransactionForm from './components/TransactionForm.jsx';
import TransactionList from './components/TransactionList.jsx';
import Modal from './components/Modal.jsx';

const API_BASE = 'http://localhost:5000/api/details';

function applyFilters(list, f) {
  return list.filter(x => {
    if (f.type && x.type !== f.type) return false;
    if (f.startDate && x.date < f.startDate) return false;
    if (f.endDate && x.date > f.endDate) return false;
    if (f.category && !x.category.toLowerCase().includes(f.category.toLowerCase())) return false;
    if (f.keyword) {
      const kw = f.keyword.toLowerCase();
      if (!(x.note || '').toLowerCase().includes(kw) && !(x.category || '').toLowerCase().includes(kw)) return false;
    }
    return true;
  });
}

function App() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ type: '', startDate: '', endDate: '', category: '', keyword: '' });
  const [editing, setEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // 从数据库加载数据
  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const response = await fetch(API_BASE);
      if (!response.ok) throw new Error('获取数据失败');
      const data = await response.json();
      setList(data);
    } catch (error) {
      console.error('加载数据失败:', error);
      alert('加载数据失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    const arr = applyFilters(list, filters);
    return [...arr].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  }, [list, filters]);

  async function addOrUpdate(item) {
    try {
      if (item.id) {
        // 更新
        const response = await fetch(`${API_BASE}/${item.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item)
        });
        if (!response.ok) throw new Error('更新失败');
        
        setList(prev => prev.map(x => x.id === item.id ? item : x));
        alert('更新成功！');
      } else {
        // 新增
        const withId = { ...item, id: Math.random().toString(36).slice(2) + Date.now().toString(36) };
        const response = await fetch(API_BASE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(withId)
        });
        if (!response.ok) throw new Error('新增失败');
        
        setList(prev => [withId, ...prev]);
        alert('添加成功！');
      }
      setShowModal(false);
      setEditing(null);
    } catch (error) {
      console.error('操作失败:', error);
      alert('操作失败: ' + error.message);
    }
  }

  async function remove(id) {
    if (!window.confirm('确定删除这条记录吗？')) return;
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('删除失败');
      
      setList(prev => prev.filter(x => x.id !== id));
      alert('删除成功！');
    } catch (error) {
      console.error('删除失败:', error);
      alert('删除失败: ' + error.message);
    }
  }

  function resetFilters() {
    setFilters({ type: '', startDate: '', endDate: '', category: '', keyword: '' });
  }

  async function wipeAll() {
    if (!window.confirm('这将清空所有数据库数据，且不可恢复。是否继续？')) return;
    try {
      const response = await fetch(API_BASE, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('清空失败');
      
      setList([]);
      setEditing(null);
      alert('所有数据已清空！');
    } catch (error) {
      console.error('清空失败:', error);
      alert('清空失败: ' + error.message);
    }
  }

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', paddingTop: 100 }}>
        <h2>加载中...</h2>
      </div>
    );
  }

  return (
    <div className="container">
      {/* 顶部：标题 + 工具栏 */}
      <div className="header" style={{ marginBottom: 20 }}>
        <div>
          <h1 className="h1">轻量记账本（React + MySQL）</h1>
          <div className="sub">记录每日收支 · 数据库保存 · 即时统计</div>
        </div>
        <div className="toolbar">
          <button
            className="btn primary"
            onClick={() => {
              setEditing(null);
              setShowModal(true);
            }}
          >
            记一笔
          </button>
          <button className="btn danger" onClick={wipeAll}>清空全部</button>
        </div>
      </div>

      {/* 第二行：筛选工具栏（整行） */}
      <div style={{ marginBottom: 20 }}>
        <Filters filters={filters} onChange={setFilters} onReset={resetFilters} />
      </div>

      {/* 第三行：KPI 3卡片（整行） */}
      <div style={{ marginBottom: 20 }}>
        <KpiCards items={filtered} />
      </div>

      {/* 第四行：图表（饼图 1/3 + 柱图 2/3） */}
      <div style={{ marginBottom: 24 }}>
        <Charts items={filtered} filterType={filters.type} />
      </div>

      {/* 第五行：表格 */}
      <div style={{ marginBottom: 24 }}>
        <TransactionList
          items={filtered}
          onEdit={(row) => {
            setEditing(row);
            setShowModal(true);
          }}
          onDelete={remove}
        />
      </div>

      {/* 页脚提示 */}
      <div className="sub" style={{ textAlign: 'center', fontSize: 13, color: '#64748b', paddingBottom: 24 }}>
        数据保存在MySQL数据库中。确保后端服务器正常运行。
      </div>

      {/* 弹窗部分 */}
      <Modal visible={showModal} onClose={() => setShowModal(false)}>
        <TransactionForm
          editing={editing}
          onSubmit={addOrUpdate}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
}

export default App;
