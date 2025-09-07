"use client";

import Link from "next/link";
import { Card, Typography, Space } from "antd";

export default function DemosIndex() {
  const items = [
    { key: "a", title: "方案A · 极简清爽风", desc: "简洁留白、柔和配色、圆角柱状图" },
    { key: "b", title: "方案B · TOP3 领奖台 + 渐变柱", desc: "突出前三名、渐变圆角柱、列表进度条" },
    { key: "c", title: "方案C · Neumorphism 拟物卡片", desc: "柔和阴影、浮起卡片、微交互动效" },
    { key: "d", title: "方案D · 紧凑排行榜表格", desc: "排名徽章、缩写头像、紧凑信息密度" },
    { key: "e", title: "方案E · 玻璃拟态", desc: "毛玻璃卡片、渐变背景、霓虹点缀" },
    { key: "f", title: "方案F · 头像进度环 + 丝带徽章", desc: "彩虹头像环、角标丝带、渐变胶囊标签" },
    { key: "g", title: "方案G · 领奖台 + 玻璃拟态 + 徽章", desc: "Top3领奖台，Top4-10玻璃卡，Top1-6徽章" },
  ];

  return (
    <div className="p-6">
      <Typography.Title level={3}>排行榜 Demo 入口</Typography.Title>
      <Space direction="vertical" size="large" className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((it) => (
            <Link key={it.key} href={`/demos/${it.key}`}>
              <Card hoverable title={it.title} className="h-full">
                <div className="text-gray-600">{it.desc}</div>
              </Card>
            </Link>
          ))}
        </div>
      </Space>
    </div>
  );
}