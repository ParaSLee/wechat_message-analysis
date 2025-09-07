"use client";

import { Card, Typography } from "antd";

const data = Array.from({ length: 9 }).map((_, i) => ({
  name: `成员${i + 1}`,
  value: Math.round(Math.random() * 160 + 40),
})).sort((a,b)=>b.value-a.value);

export default function DemoE() {
  const max = Math.max(...data.map(d=>d.value));
  return (
    <div className="p-6 glass-bg min-h-screen">
      <Typography.Title level={3} style={{ color: '#0f172a' }}>方案E · 玻璃拟态</Typography.Title>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {data.map((it, idx) => (
          <div key={it.name} className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-700">排名</div>
              <div className="text-2xl font-bold text-slate-900">NO.{idx + 1}</div>
            </div>
            <div className="mt-4">
              <div className="text-slate-800 font-medium">{it.name}</div>
              <div className="mt-2 h-2 rounded-full bg-white/60" style={{ position: 'relative' }}>
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: `${Math.min(100, Math.round((it.value / max) * 100))}%`,
                    background: "linear-gradient(90deg, rgba(99,102,241,0.9), rgba(16,185,129,0.9))",
                    boxShadow: "0 4px 12px rgba(99,102,241,0.35)",
                  }}
                />
              </div>
              <div className="mt-3 text-xs text-slate-700">发言次数：{it.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}