import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import App from './App.jsx';

// 抑制 ResizeObserver 循环错误（这是一个已知的浏览器问题，不影响功能）
const originalConsoleError = console.error;
console.error = (...args) => {
  const firstArg = args[0];
  if (typeof firstArg === 'string') {
    if (
      firstArg.includes('ResizeObserver loop') ||
      firstArg.includes('ResizeObserver loop limit exceeded') ||
      firstArg.includes('ResizeObserver loop completed')
    ) {
      return; // 忽略 ResizeObserver 错误
    }
  }
  originalConsoleError.apply(console, args);
};

// 捕获全局 ResizeObserver 错误
window.addEventListener('error', (e) => {
  if (
    e.message === 'ResizeObserver loop limit exceeded' ||
    e.message === 'ResizeObserver loop completed with undelivered notifications.' ||
    e.message.includes('ResizeObserver')
  ) {
    e.stopImmediatePropagation();
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
