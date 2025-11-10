/**
 * 格式化日期为 YYYY-MM-DD 格式
 * @param {string|Date} dateInput - 日期字符串或Date对象
 * @returns {string} 格式化后的日期字符串 YYYY-MM-DD
 */
export function formatDate(dateInput) {
  if (!dateInput) return '';
  
  let date;
  if (typeof dateInput === 'string') {
    // 如果是ISO格式 (2025-11-09T16:00:00.000Z)，转换为Date对象
    date = new Date(dateInput);
  } else if (dateInput instanceof Date) {
    date = dateInput;
  } else {
    return '';
  }
  
  // 获取年月日
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

/**
 * 获取今天的日期 YYYY-MM-DD 格式
 * @returns {string} 今天的日期
 */
export function getTodayDate() {
  return formatDate(new Date());
}


