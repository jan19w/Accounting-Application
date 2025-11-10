import React, { useState, useMemo } from 'react';
import EmptyState from './EmptyState.jsx';
import { formatDate } from '../utils/dateFormat.js';

function fmt(n) {
  return (Number(n) || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function TransactionList({ items, onEdit, onDelete }) {
  const pageSize = 8; // 每页显示条数
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  const currentPageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [page, items]);

  function goToPage(p) {
    if (p < 1 || p > totalPages) return;
    setPage(p);
  }

  if (!items.length)
    return (
      <div className="card section">
        <EmptyState text="暂无符合条件的记录" />
      </div>
    );

  return (
    <div className="card section" style={{ overflowX: 'auto' }}>
      <table className="table">
        <thead>
          <tr>
            <th>日期</th>
            <th>类型</th>
            <th>类别</th>
            <th>金额（¥）</th>
            <th>备注</th>
            <th style={{ width: 140 }}>操作</th>
          </tr>
        </thead>
        <tbody>
          {currentPageItems.map((row) => (
            <tr key={row.id}>
              <td>{formatDate(row.date)}</td>
              <td>
                <span
                  className={`badge ${
                    row.type === 'income' ? 'income' : 'expense'
                  }`}
                >
                  {row.type === 'income' ? '收入' : '支出'}
                </span>
              </td>
              <td>{row.category}</td>
              <td>{fmt(row.amount)}</td>
              <td>{row.note || '-'}</td>
              <td>
                <div className="row-actions">
                  <button className="btn" onClick={() => onEdit(row)}>
                    编辑
                  </button>
                  <button className="btn danger" onClick={() => onDelete(row.id)}>
                    删除
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 分页控制 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 12,
          marginTop: 16,
        }}
      >
        <button
          className="btn"
          disabled={page === 1}
          onClick={() => goToPage(page - 1)}
        >
          上一页
        </button>

        <span style={{ fontSize: 14, color: '#64748b' }}>
          第 {page} / {totalPages} 页
        </span>

        <button
          className="btn"
          disabled={page === totalPages}
          onClick={() => goToPage(page + 1)}
        >
          下一页
        </button>
      </div>
    </div>
  );
}
