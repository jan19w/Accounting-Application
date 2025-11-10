const KEY = 'bk_transactions_v1';

export function loadTx() {
  try {
    const raw = localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : null;
    if (Array.isArray(arr)) return arr;
  } catch (_) {}
  return seed(); // 首次无数据时写入演示数据
}

export function saveTx(list) {
  localStorage.setItem(KEY, JSON.stringify(list || []));
}

export function clearTx() {
  localStorage.removeItem(KEY);
}

function seed() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');

  const demo = [
    { id: cryptoRandom(), type: 'income',  category: '工资', amount: 8000, date: `${yyyy}-${mm}-01`, note: '十月薪资' },
    { id: cryptoRandom(), type: 'expense', category: '餐饮', amount: 62,   date: `${yyyy}-${mm}-${dd}`, note: '午餐' },
    { id: cryptoRandom(), type: 'expense', category: '交通', amount: 18,   date: `${yyyy}-${mm}-${dd}`, note: '地铁' },
    { id: cryptoRandom(), type: 'expense', category: '购物', amount: 299, date: `${yyyy}-${mm}-${dd}`, note: '生活用品' },
  ];
  saveTx(demo);
  return demo;
}

function cryptoRandom() {
  // 简单 uid
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
