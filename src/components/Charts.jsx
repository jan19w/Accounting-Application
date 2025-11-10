import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { getCategoriesForType } from "../utils/categories.js";

export default function Charts({ items, filterType }) {
  const pieRef = useRef(null);
  const barRef = useRef(null);

  const income = items
    .filter((x) => x.type === "income")
    .reduce((s, x) => s + Number(x.amount || 0), 0);
  const expense = items
    .filter((x) => x.type === "expense")
    .reduce((s, x) => s + Number(x.amount || 0), 0);

  // 初始化饼图（使用 SVG 渲染器，避免缩放环境下像素错位）
  useEffect(() => {
    const chart = echarts.init(pieRef.current, null, { renderer: 'svg' });
    const total = income + expense;
    const option = {
      title: {
        text: "收入 vs 支出",
        left: "center",
        top: 10,
        textStyle: { fontSize: 15, fontWeight: 600 },
      },
      tooltip: {
        trigger: "item",
        backgroundColor: "rgba(0,0,0,0.75)",
        borderWidth: 0,
        textStyle: { color: "#fff", fontSize: 12 },
        formatter: (params) => {
          return `${params.name}<br/>¥${params.value.toLocaleString()}<br/>${params.percent}%`;
        },
      },
      legend: {
        orient: "horizontal",
        left: "center",
        bottom: 15,
        itemGap: 20,
        itemWidth: 14,
        itemHeight: 14,
      },
      series: [
        {
          type: "pie",
          radius: ["42%", "68%"],
          center: ["50%", "48%"],
          data: [
            { value: income, name: "收入" },
            { value: expense, name: "支出" },
          ],
          itemStyle: {
            color: (params) =>
              params.name === "收入" ? "#16a34a" : "#ef4444",
            borderRadius: 4,
          },
          label: { 
            formatter: "{b}\n{d}%",
            fontSize: 12,
            lineHeight: 16,
            color: "#0f172a",
          },
          labelLine: {
            length: 12,
            length2: 8,
            lineStyle: {
              width: 1,
            }
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.15)'
            }
          },
          animationDuration: 800,
        },
      ],
    };
    chart.setOption(option);

    // 处理容器尺寸变化：使用 requestAnimationFrame 避免 ResizeObserver 循环错误
    let resizeTimer = null;
    const ro = new ResizeObserver(() => {
      if (resizeTimer) cancelAnimationFrame(resizeTimer);
      resizeTimer = requestAnimationFrame(() => {
        chart.resize();
      });
    });
    
    try { ro.observe(pieRef.current); } catch {}
    
    const handleResize = () => {
      if (resizeTimer) cancelAnimationFrame(resizeTimer);
      resizeTimer = requestAnimationFrame(() => {
        chart.resize();
      });
    };
    window.addEventListener('resize', handleResize);

    // 首次布局完成后强制一次 resize
    const t = setTimeout(() => chart.resize(), 100);

    return () => {
      clearTimeout(t);
      if (resizeTimer) cancelAnimationFrame(resizeTimer);
      try { ro.disconnect(); } catch {}
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, [income, expense]);

  // 初始化柱状图（使用 SVG 渲染器，避免缩放环境下像素错位）
  useEffect(() => {
    const chart = echarts.init(barRef.current, null, { renderer: 'svg' });

    // 分类统计（规范化）
    const categories = {};
    items.forEach((x) => {
      const key = ((x.category || '未分类') + '').trim();
      if (!categories[key]) categories[key] = { income: 0, expense: 0 };
      categories[key][x.type] += Number(x.amount || 0);
    });
    // 使用与筛选一致的类别顺序
    const cats = getCategoriesForType(filterType);
    const incomeVals = cats.map((c) => (categories[c]?.income) || 0);
    const expenseVals = cats.map((c) => (categories[c]?.expense) || 0);

    const option = {
      title: {
        text: "各类别收支对比",
        left: "center",
        top: 10,
        textStyle: { fontSize: 15, fontWeight: 600 },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow", shadowStyle: { opacity: 0.1 } },
        backgroundColor: "rgba(0,0,0,0.75)",
        borderWidth: 0,
        textStyle: { color: "#fff", fontSize: 12 },
        formatter: (params) => {
          let result = `${params[0].name}<br/>`;
          params.forEach(item => {
            if (item.value > 0) {
              result += `${item.seriesName}: ¥${item.value.toLocaleString()}<br/>`;
            }
          });
          return result;
        },
      },
      legend: { 
        top: 40,
        itemGap: 20,
        itemWidth: 14,
        itemHeight: 14,
      },
      grid: {
        left: 50,
        right: 30,
        bottom: 50,
        top: 80,
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: cats,
        axisTick: { 
          show: true, 
          alignWithLabel: true,
          interval: 0,
        },
        axisLabel: {
          interval: 0,
          rotate: cats.length > 6 ? 25 : 0,
          margin: 10,
          fontSize: 11,
        },
        axisLine: {
          lineStyle: { color: "#e2e8f0" }
        },
      },
      yAxis: {
        type: "value",
        name: "金额（¥）",
        nameTextStyle: {
          fontSize: 11,
          color: "#64748b",
          padding: [0, 0, 0, -10]
        },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: {
          lineStyle: { color: "#f1f5f9" }
        },
      },
      series: [
        {
          name: "收入",
          type: "bar",
          data: incomeVals,
          itemStyle: { 
            color: "#16a34a",
            borderRadius: [4, 4, 0, 0]
          },
          barMaxWidth: 32,
          barGap: "10%",
          emphasis: {
            itemStyle: {
              color: "#15803d"
            }
          }
        },
        {
          name: "支出",
          type: "bar",
          data: expenseVals,
          itemStyle: { 
            color: "#ef4444",
            borderRadius: [4, 4, 0, 0]
          },
          barMaxWidth: 32,
          emphasis: {
            itemStyle: {
              color: "#dc2626"
            }
          }
        },
      ],
      animationDuration: 800,
    };
    chart.setOption(option);

    // ✅ 处理容器尺寸变化：使用 requestAnimationFrame 避免 ResizeObserver 循环错误
    let resizeTimer = null;
    const ro = new ResizeObserver(() => {
      if (resizeTimer) cancelAnimationFrame(resizeTimer);
      resizeTimer = requestAnimationFrame(() => {
        chart.resize();
      });
    });
    
    try { ro.observe(barRef.current); } catch {}
    
    const handleResize = () => {
      if (resizeTimer) cancelAnimationFrame(resizeTimer);
      resizeTimer = requestAnimationFrame(() => {
        chart.resize();
      });
    };
    window.addEventListener('resize', handleResize);

    // 首次布局完成后强制一次 resize
    const t = setTimeout(() => chart.resize(), 100);

    return () => {
      clearTimeout(t);
      if (resizeTimer) cancelAnimationFrame(resizeTimer);
      try { ro.disconnect(); } catch {}
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, [items, filterType]);

  return (
    <div className="charts-grid">
      {/* 饼图 */}
      <div className="card" style={{ padding: 16 }}>
        <div
          style={{
            background: "#fff",
            borderRadius: 8,
            height: 320,
          }}
          ref={pieRef}
        />
      </div>

      {/* 柱状图 */}
      <div className="card" style={{ padding: 16 }}>
        <div
          style={{
            background: "#fff",
            borderRadius: 8,
            height: 320,
          }}
          ref={barRef}
        />
      </div>
    </div>
  );
}

