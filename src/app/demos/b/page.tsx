"use client";

import { Card, Typography, Space, Progress, Avatar, Tag, Segmented } from "antd";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { CrownFilled, TrophyFilled } from "@ant-design/icons";
import { useState } from "react";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658", "#8dd1e1", "#a4de6c", "#d0ed57"]; 

import { generateDemoData } from '@/utils/mockData';

const data = generateDemoData('b');

export default function DemoB() {
  const [view, setView] = useState<'chart' | 'list' | 'cards'>('chart');
  const max = Math.max(...data.map(d => d.value));
  const top3 = [...data].sort((a,b)=>b.value-a.value).slice(0,3);

  return (
    <div className="p-6">
      <Typography.Title level={3}>方案B · TOP3 领奖台 + 渐变柱</Typography.Title>

      <Card className="shadow-sm mb-6" title="活跃 TOP 3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {top3.map((it, idx) => {
            const rank = idx + 1;
            const cls = rank === 1 ? 'podium-gold' : rank === 2 ? 'podium-silver' : 'podium-bronze';
            return (
              <div key={it.name} className={`rounded-lg p-5 ${cls}`}>
                <div className="flex items-center justify-between">
                  <Space size="large">
                    {rank === 1 ? <CrownFilled style={{ fontSize: 28 }} /> : <TrophyFilled style={{ fontSize: 28 }} />}
                    <div>
                      <div className="text-lg font-semibold">{it.name}</div>
                      <div className="opacity-90">发言 {it.value} 次</div>
                    </div>
                  </Space>
                  <div className="text-3xl font-extrabold">NO.{rank}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="shadow-sm" title="发言次数 Top 10"
        extra={<Segmented value={view} onChange={(v)=>setView(v as any)} options={[{label:'柱状图',value:'chart'},{label:'列表',value:'list'},{label:'卡片',value:'cards'}]} />}
      >
        {view === 'chart' && (
          <ResponsiveContainer width="100%" height={380}>
            <BarChart data={data.slice(0,10)} margin={{ top: 16, right: 16, left: 0, bottom: 48 }}>
              <defs>
                {data.slice(0,10).map((_, i) => (
                  <linearGradient id={`grad-${i}`} key={i} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={COLORS[i % COLORS.length]} stopOpacity={1} />
                    <stop offset="100%" stopColor={COLORS[(i+1) % COLORS.length]} stopOpacity={0.6} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" angle={-30} textAnchor="end" height={50} tick={{ fill: '#334155' }} />
              <YAxis tick={{ fill: '#334155' }} />
              <Tooltip contentStyle={{ borderRadius: 8 }} />
              <Bar dataKey="value" radius={[8,8,0,0]} maxBarSize={40}>
                {data.slice(0,10).map((_, i) => (
                  <Cell key={i} fill={`url(#grad-${i})`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}

        {view === 'list' && (
          <div className="space-y-3">
            {data.map((m, idx) => (
              <div key={m.name} className="flex items-center gap-3">
                <span style={{width:56}}>
                  {idx < 3 ? (
                    <Tag color={idx === 0 ? 'gold' : idx === 1 ? 'default' : 'orange'} className="rank-badge">NO.{idx+1}</Tag>
                  ) : (
                    idx+1
                  )}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar style={{ backgroundColor: COLORS[idx % COLORS.length] }}>{m.name.slice(0,1)}</Avatar>
                      <span>{m.name}</span>
                    </div>
                    <span className="text-gray-500">{m.value}</span>
                  </div>
                  <Progress percent={Math.round((m.value / max) * 100)} showInfo={false} size="small" />
                </div>
              </div>
            ))}
          </div>
        )}

        {view === 'cards' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
            {data.slice(0,12).map((s, idx) => (
              <Card key={s.name} hoverable>
                <Space className="w-full justify-between">
                  <Space>
                    <Avatar style={{ backgroundColor: COLORS[idx % COLORS.length] }}>{s.name.slice(0,1)}</Avatar>
                    <div>
                      <div className="font-semibold">{s.name}</div>
                      <div className="text-gray-500 text-sm">排名 NO.{idx + 1}</div>
                    </div>
                  </Space>
                  <div className="text-right">
                    <div className="text-xl font-bold">{s.value}</div>
                    <div className="text-gray-500 text-xs">发言次数</div>
                  </div>
                </Space>
                <div className="mt-3">
                  <Progress percent={Math.round((s.value / max) * 100)} showInfo={false} size="small" />
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}