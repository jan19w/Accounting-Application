# 记账本应用 - 数据库配置说明

## 功能概述
这是一个完整的记账本应用，支持：
- ✅ 查询所有记录（GET）
- ✅ 新增记录（POST）
- ✅ 更新记录（PUT）
- ✅ 删除记录（DELETE）
- ✅ 批量清空（DELETE ALL）

## 数据库配置

### 1. 安装MySQL
确保已安装MySQL数据库服务器（MySQL 5.7+或8.0+）

### 2. 初始化数据库
在MySQL中执行以下命令：

```bash
mysql -u root -p < server/init.sql
```

或者手动在MySQL客户端中执行 `server/init.sql` 文件中的SQL语句。

### 3. 配置数据库连接
编辑 `server/server.js` 文件中的数据库配置：

```javascript
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',           // 你的MySQL用户名
    password: 'password',   // 你的MySQL密码
    database: 'projectdata'
});
```

## 数据表结构

### details表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | VARCHAR(50) | 主键，记录ID |
| type | ENUM('income', 'expense') | 类型：income(收入) / expense(支出) |
| category | VARCHAR(50) | 类别（如：工资、餐饮、交通等） |
| amount | DECIMAL(10, 2) | 金额 |
| date | DATE | 日期 |
| note | TEXT | 备注 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

## API接口说明

### 基础URL
```
http://localhost:5000/api/details
```

### 1. 查询所有记录
```http
GET /api/details
```

**响应示例：**
```json
[
  {
    "id": "abc123",
    "type": "expense",
    "category": "餐饮",
    "amount": "62.50",
    "date": "2025-11-10",
    "note": "午餐"
  }
]
```

### 2. 新增记录
```http
POST /api/details
Content-Type: application/json

{
  "id": "abc123",
  "type": "expense",
  "category": "餐饮",
  "amount": 62.50,
  "date": "2025-11-10",
  "note": "午餐"
}
```

### 3. 更新记录
```http
PUT /api/details/:id
Content-Type: application/json

{
  "type": "expense",
  "category": "餐饮",
  "amount": 75.00,
  "date": "2025-11-10",
  "note": "晚餐"
}
```

### 4. 删除记录
```http
DELETE /api/details/:id
```

### 5. 清空所有记录
```http
DELETE /api/details
```

## 启动应用

### 1. 启动后端服务器
```bash
cd server
npm install
node server.js
```

服务器将在 http://localhost:5000 运行

### 2. 启动前端应用
```bash
cd ..
npm install
npm start
```

前端应用将在 http://localhost:3000 运行

## 注意事项

1. **数据库必须先运行**：确保MySQL服务已启动
2. **端口占用**：确保5000端口（后端）和3000端口（前端）未被占用
3. **CORS配置**：后端已配置CORS，支持跨域请求
4. **数据持久化**：所有数据保存在MySQL数据库中，不会丢失

## 故障排查

### 无法连接数据库
- 检查MySQL服务是否启动
- 检查用户名和密码是否正确
- 检查数据库名称是否为 `projectdata`

### 前端无法获取数据
- 检查后端服务器是否启动
- 检查浏览器控制台是否有CORS错误
- 确认API地址为 http://localhost:5000

### 表不存在错误
- 执行 `server/init.sql` 初始化数据库
- 或手动创建 `details` 表


