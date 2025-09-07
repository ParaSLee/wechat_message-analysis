"use client";

import { Card, Typography, Space, Progress } from "antd";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const mock = Array.from({ length: 10 }).map((_, i) => ({
  name: `成员${i + 1}`,
  value: Math.round(Math.random() * 120 + 20),
}));

export default function DemoA() {
  const max = Math.max(...mock.map(m => m.value));
  return (
    <div className="p-6">
      <Typography.Title level={3}>方案A · 极简清爽风</Typography.Title>
      <Card className="shadow-sm">
        <ResponsiveContainer width="100%" height={380}>
          <BarChart data={mock} margin={{ top: 16, right: 16, left: 0, bottom: 48 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" angle={-30} textAnchor="end" height={50} tick={{ fill: '#334155' }} />
            <YAxis tick={{ fill: '#334155' }} />
            <Tooltip contentStyle={{ borderRadius: 8 }} />
            <Bar dataKey="value" fill="#64748b" radius={[6, 6, 0, 0]} maxBarSize={36} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="mt-6 shadow-sm" title="紧凑列表">
        <Space direction="vertical" className="w-full">
          {mock.map((m) => (
            <div key={m.name} className="flex items-center gap-3">
              <span className="w-16 text-gray-600">{m.name}</span>
              <div className="flex-1">
                <Progress percent={Math.round((m.value / max) * 100)} showInfo={false} size="small" />
              </div>
              <span className="w-12 text-right">{m.value}</span>
            </div>
          ))}
        </Space>
      </Card>
    </div>
  );
}