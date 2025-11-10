-- 创建数据库（如果不存在）
CREATE DATABASE IF NOT EXISTS projectdata CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 使用数据库
USE projectdata;

-- 创建details表（如果不存在）
CREATE TABLE IF NOT EXISTS details (
    id VARCHAR(50) PRIMARY KEY COMMENT '记录ID',
    type ENUM('income', 'expense') NOT NULL COMMENT '类型：收入/支出',
    category VARCHAR(50) NOT NULL COMMENT '类别',
    amount DECIMAL(10, 2) NOT NULL COMMENT '金额',
    date DATE NOT NULL COMMENT '日期',
    note TEXT COMMENT '备注',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_date (date),
    INDEX idx_type (type),
    INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='记账明细表';

-- 插入一些示例数据（可选）
INSERT INTO details (id, type, category, amount, date, note) VALUES
('demo1', 'income', '工资', 8000.00, CURDATE(), '月度薪资'),
('demo2', 'expense', '餐饮', 62.50, CURDATE(), '午餐'),
('demo3', 'expense', '交通', 18.00, CURDATE(), '地铁费用'),
('demo4', 'expense', '购物', 299.00, CURDATE(), '生活用品')
ON DUPLICATE KEY UPDATE id=id;

-- 查询表结构
DESC details;

-- 查询当前数据
SELECT * FROM details ORDER BY date DESC, created_at DESC;


