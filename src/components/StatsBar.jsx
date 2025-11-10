import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { getCategoriesForType } from "../utils/categories.js";

function format(n) {
  return (Number(n) || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function StatsBar({ items, filterType }) {
  const pieRef = useRef(null);
  const barRef = useRef(null);

  const income = items
    .filter((x) => x.type === "income")
    .reduce((s, x) => s + Number(x.amount || 0), 0);
  const expense = items
    .filter((x) => x.type === "expense")
    .reduce((s, x) => s + Number(x.amount || 0), 0);
  const balance = income - expense;

  // 初始化饼图（使用 SVG 渲染器，避免缩放环境下像素错位）
  useEffect(() => {
    const chart = echarts.init(pieRef.current, null, { renderer: 'svg' });
    const total = income + expense;
    const option = {
      title: {
        text: "收入 vs 支出",
        left: "center",
        top: 5,
        textStyle: { fontSize: 14 },
      },
      tooltip: {
        trigger: "item",
        formatter: "{b}：¥{c}（{d}%）",
      },
      legend: {
        orient: "vertical",
        left: "left",
        top: 30,
      },
      series: [
        {
          type: "pie",
          radius: ["35%", "70%"],
          center: ["50%", "60%"],
          data: [
            { value: income, name: "收入" },
            { value: expense, name: "支出" },
          ],
          itemStyle: {
            color: (params) =>
              params.name === "收入" ? "#16a34a" : "#ef4444",
          },
          label: { formatter: "{b}: {d}%" },
          animationDuration: 800,
        },
      ],
    };
    chart.setOption(option);
    return () => chart.dispose();
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
        textStyle: { fontSize: 14 },
    },
    tooltip: {
        trigger: "item",                 // ✅ 只在当前柱条触发，而不是整条轴
        axisPointer: { type: "none" },   // ✅ 禁用轴指示线
        backgroundColor: "rgba(0,0,0,0.75)",
        borderWidth: 0,
        textStyle: { color: "#fff", fontSize: 12 },
        formatter: (params) => {
            return `${params.seriesName} - ${params.name}<br/>¥${params.value.toLocaleString()}`;
        },
    },
    legend: { top: 30 },
      grid: {
          left: 60,
          right: 40,
          bottom: 80, // ✅ 留足标签空间
          top: 70,
          containLabel: true, // ✅ 包含坐标轴标签，避免绘图区域和标签错位
      },
      xAxis: {
        type: "category",
        data: cats,
          boundaryGap: true, // ✅ 柱状图需要类目边界留白
          axisTick: { show: true, alignWithLabel: true }, // ✅ 与标签对齐
          axisLabel: {
            interval: 0,
            rotate: cats.length > 6 ? 30 : 0,
            align: "center",
            margin: 12,
          },
    },
    yAxis: {
        type: "value",
        name: "金额（¥）",
    },
    series: [
        {
        name: "收入",
        type: "bar",
        data: incomeVals,
        itemStyle: { color: "#16a34a" },
          barMaxWidth: 28,
          // 使用默认间距以减少视觉偏移
        },
        {
        name: "支出",
        type: "bar",
        data: expenseVals,
        itemStyle: { color: "#ef4444" },
          barMaxWidth: 28,
        },
    ],
    animationDuration: 800,
    };
    chart.setOption(option);

    // ✅ 处理容器尺寸变化：ResizeObserver + 窗口 resize
    const ro = new ResizeObserver(() => chart.resize());
    try { ro.observe(barRef.current); } catch {}
    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    // 首次布局完成后强制一次 resize，确保像素对齐
    const t = setTimeout(() => chart.resize(), 0);

    return () => {
      clearTimeout(t);
      try { ro.disconnect(); } catch {}
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, [items]);

  return (
    <div>
      {/* 数字概览 */}
      <div className="kpi">
        <div className="item">
          <div className="label">本期收入</div>
          <div className="value">¥ {format(income)}</div>
        </div>
        <div className="item">
          <div className="label">本期支出</div>
          <div className="value">¥ {format(expense)}</div>
        </div>
        <div className="item">
          <div className="label">结余</div>
          <div className="value">¥ {format(balance)}</div>
        </div>
      </div>

      {/* ECharts 图表 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          gap: 16,
          marginTop: 16,
        }}
      >
        <div
          style={{
            background: "#fff",
            border: "1px dashed #e2e8f0",
            borderRadius: 12,
            padding: "8px",
            height: 350,
          }}
          ref={pieRef}
        />
        <div
          style={{
            background: "#fff",
            border: "1px dashed #e2e8f0",
            borderRadius: 12,
            padding: "8px",
            height: 350,
          }}
          ref={barRef}
        />
      </div>
    </div>
  );
}
