import React, { useEffect, useState } from 'react';
import { CATEGORY_OPTIONS } from "../utils/categories.js";
import { formatDate } from "../utils/dateFormat.js";

const DEFAULT = {
  id: '',
  type: 'expense',
  category: '',
  amount: '',
  date: '',
  note: ''
};

// 类别选项改为从公共模块引入


export default function TransactionForm({ editing, onSubmit, onCancel }) {
  const [form, setForm] = useState(DEFAULT);
  useEffect(() => { 
    setForm(editing ? { 
      ...editing, 
      amount: String(editing.amount),
      date: formatDate(editing.date) // 确保日期格式正确
    } : DEFAULT); 
  }, [editing]);

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  function validate() {
    if (!form.date) return '请填写日期';
    if (!form.category.trim()) return '请填写类别';
    const amt = Number(form.amount);
    if (!amt || amt <= 0) return '金额需为大于 0 的数字';
    if (!['income', 'expense'].includes(form.type)) return '类型不正确';
    return '';
  }

  function submit() {
    const msg = validate();
    if (msg) { alert(msg); return; }
    onSubmit({ ...form, amount: Number(form.amount) });
  }

  return (
    <div className="card section">
      <div className="header">
        <div>
          <h2 className="h1" style={{ fontSize: 18 }}>{editing ? '编辑账单' : '新增账单'}</h2>
          <div className="sub">{editing ? '修改当前记录' : '添加一条新的收支记录'}</div>
        </div>
      </div>

      <div className="form-row">
        <div>
          <div className="label">类型</div>
          <select className="select" value={form.type} onChange={e => set('type', e.target.value)}>
            <option value="expense">支出</option>
            <option value="income">收入</option>
          </select>
        </div>
        <div>
          <div className="label">日期</div>
          <input className="input" type="date" value={form.date} onChange={e => set('date', e.target.value)} />
        </div>
      </div>

      <div className="form-row">
        <div>
        <div className="label">类别</div>
        <select
            className="select"
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
        >
            <option value="">请选择类别</option>
            {(CATEGORY_OPTIONS[form.type] || []).map((opt) => (
            <option key={opt} value={opt}>
                {opt}
            </option>
            ))}
        </select>
        </div>


        <div>
          <div className="label">金额（¥）</div>
          <input className="input" type="number" step="0.01" min="0" placeholder="0.00"
                 value={form.amount} onChange={e => set('amount', e.target.value)} />
        </div>
      </div>

      <div className="form-row full">
        <div>
          <div className="label">备注</div>
          <textarea className="textarea" placeholder="可不填" value={form.note}
                    onChange={e => set('note', e.target.value)} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        {editing && <button className="btn" onClick={onCancel}>取消</button>}
        <button className="btn primary" onClick={submit}>{editing ? '保存' : '添加'}</button>
      </div>
    </div>
  );
}
