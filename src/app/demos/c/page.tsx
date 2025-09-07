"use client";

import { Card, Typography, Space } from "antd";

const data = Array.from({ length: 9 }).map((_, i) => ({
  name: `成员${i + 1}`,
  value: Math.round(Math.random() * 100 + 20),
}));

export default function DemoC() {
  return (
    <div className="p-6 neu-surface min-h-screen">
      <Typography.Title level={3}>方案C · Neumorphism 拟物卡片</Typography.Title>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {data.map((it, idx) => (
          <div key={it.name} className="neu-card p-6">
            <Space className="w-full justify-between">
              <div>
                <div className="text-gray-700 text-sm">排名</div>
                <div className="text-3xl font-extrabold">NO.{idx + 1}</div>
              </div>
              <div className="neu-pressed px-5 py-3 text-center">
                <div className="text-xs text-gray-600">发言次数</div>
                <div className="text-2xl font-bold">{it.value}</div>
              </div>
            </Space>
            <div className="mt-5">
              <div className="text-gray-600">{it.name}</div>
              <div className="mt-3 h-3 rounded-full neu-pressed" style={{ position: 'relative' }}>
                <div
                  className="h-3 rounded-full"
                  style={{
                    width: `${Math.min(100, Math.round((it.value / Math.max(...data.map(d=>d.value))) * 100))}%`,
                    background: "linear-gradient(90deg, #60a5fa, #34d399)",
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}