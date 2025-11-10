import React from 'react';

export default function EmptyState({ text = '暂无数据' }) {
  return (
    <div className="empty">
      <div style={{ fontSize: 48, lineHeight: 1 }}>🧾</div>
      <div style={{ marginTop: 8 }}>{text}</div>
    </div>
  );
}
