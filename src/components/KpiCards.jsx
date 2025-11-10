import React from "react";

function format(n) {
  return (Number(n) || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function KpiCards({ items }) {
  const income = items
    .filter((x) => x.type === "income")
    .reduce((s, x) => s + Number(x.amount || 0), 0);
  const expense = items
    .filter((x) => x.type === "expense")
    .reduce((s, x) => s + Number(x.amount || 0), 0);
  const balance = income - expense;

  return (
    <div className="kpi">
      <div className="item">
        <div className="label">本期收入</div>
        <div className="value" style={{ color: "#16a34a" }}>¥ {format(income)}</div>
      </div>
      <div className="item">
        <div className="label">本期支出</div>
        <div className="value" style={{ color: "#ef4444" }}>¥ {format(expense)}</div>
      </div>
      <div className="item">
        <div className="label">结余</div>
        <div className="value" style={{ color: balance >= 0 ? "#2563eb" : "#ef4444" }}>
          ¥ {format(balance)}
        </div>
      </div>
    </div>
  );
}







