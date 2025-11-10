import React from "react";
import { CATEGORY_OPTIONS, getCategoriesForType } from "../utils/categories.js";

export default function Filters({ filters, onChange, onReset }) {
  const handle = (k, v) => onChange({ ...filters, [k]: v });

  return (
    <div className="card section" style={{ padding: "16px 24px", overflowX: "auto" }}>
      {/* 横向工具栏布局 - 强制一行不换行，居中显示 */}
      <div
        style={{
          display: "flex",
          flexWrap: "nowrap",
          gap: "12px",
          alignItems: "center",
          justifyContent: "center",
          minWidth: "fit-content",
        }}
      >
        {/* 类型 */}
        <select
          className="select"
          value={filters.type}
          onChange={(e) => handle("type", e.target.value)}
          style={{ width: 120, flexShrink: 0 }}
        >
          <option value="">全部类型</option>
          <option value="income">收入</option>
          <option value="expense">支出</option>
        </select>

        {/* 类别 */}
        <select
          className="select"
          value={filters.category}
          onChange={(e) => handle("category", e.target.value)}
          style={{ width: 140, flexShrink: 0 }}
        >
          <option value="">全部类别</option>
          {getCategoriesForType(filters.type).map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        {/* 起始日期 */}
        <input
          type="date"
          className="input"
          value={filters.startDate}
          onChange={(e) => handle("startDate", e.target.value)}
          style={{ width: 160, flexShrink: 0 }}
        />

        {/* 结束日期 */}
        <input
          type="date"
          className="input"
          value={filters.endDate}
          onChange={(e) => handle("endDate", e.target.value)}
          style={{ width: 160, flexShrink: 0 }}
        />

        {/* 关键词输入框 */}
        <input
          className="input"
          placeholder="备注关键词"
          value={filters.keyword}
          onChange={(e) => handle("keyword", e.target.value)}
          style={{ width: 180, flexShrink: 0 }}
        />

        {/* 清空按钮 - 显眼样式 */}
        <button 
          className="btn" 
          onClick={onReset} 
          style={{ 
            flexShrink: 0, 
            whiteSpace: "nowrap",
            borderColor: "#2563eb",
            color: "#2563eb",
            fontWeight: 600,
            boxShadow: "0 0 0 1px #2563eb inset"
          }}
        >
          清空筛选
        </button>
      </div>
    </div>
  );
}
