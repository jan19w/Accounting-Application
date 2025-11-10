export const CATEGORY_OPTIONS = {
  income: ["工资", "奖金", "投资收益", "其他收入"],
  expense: ["餐饮", "交通", "购物", "娱乐", "医疗", "住房", "教育", "其他支出"],
};

export function getCategoriesForType(type) {
  if (type === 'income') return CATEGORY_OPTIONS.income;
  if (type === 'expense') return CATEGORY_OPTIONS.expense;
  // 全部类型：支出在前，收入在后，保持图表与筛选一致
  return [...CATEGORY_OPTIONS.expense, ...CATEGORY_OPTIONS.income];
}


