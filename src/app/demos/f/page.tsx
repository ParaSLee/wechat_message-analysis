"use client";

import { useMemo } from "react";
import { Typography, Card, Row, Col } from "antd";

// 设计灵感：Dribbble 上常见的玻璃拟态/渐变胶囊/彩色头像环，强调层级与色彩节奏。
// 为避免 Next.js SSR/CSR Hydration 不一致，使用“种子随机数”生成稳定的 mock 数据。

import { generateDemoData } from '@/utils/mockData';

export default function DemoF() {
  const data = useMemo(() => generateDemoData('f'), []);
  const max = useMemo(() => Math.max(...data.map((m) => m.value)), [data]);

  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={3} style={{ marginBottom: 0 }}>
        方案F · 头像进度环 + 丝带徽章 + 渐变胶囊
      </Typography.Title>
      <Typography.Paragraph type="secondary" style={{ marginTop: 8 }}>
        稳定 mock 数据，无需后端即可预览。彩色进度环表示占比，丝带突出排名，胶囊显示次数。
      </Typography.Paragraph>

      <Row gutter={[16, 16]} style={{ marginTop: 8 }}>
        {data.map((m, idx) => {
          const percent = Math.min(100, Math.round((m.value / max) * 100));
          const hue = (idx * 36) % 360;
          return (
            <Col key={m.name} xs={24} sm={12} lg={8}>
              <Card hoverable style={{ position: "relative", overflow: "hidden" }}>
                {/* 丝带徽章 */}
                <div
                  style={{
                    position: "absolute",
                    right: -32,
                    top: 16,
                    transform: "rotate(45deg)",
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 700,
                    padding: "4px 40px",
                    background: `linear-gradient(90deg, hsl(${hue},85%,55%), hsl(${(hue + 60) % 360},85%,55%))`,
                    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                    pointerEvents: "none",
                  }}
                >
                  NO.{idx + 1}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  {/* 头像彩虹进度环 */}
                  <div style={{ position: "relative", width: 64, height: 64 }}>
                    <svg width="64" height="64" viewBox="0 0 64 64">
                      <defs>
                        <linearGradient id={`ring-${idx}`} x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor={`hsl(${hue},85%,55%)`} />
                          <stop offset="100%" stopColor={`hsl(${(hue + 60) % 360},85%,55%)`} />
                        </linearGradient>
                      </defs>
                      <circle cx="32" cy="32" r="28" stroke="#e5e7eb" strokeWidth="6" fill="none" />
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke={`url(#ring-${idx})`}
                        strokeWidth="6"
                        strokeLinecap="round"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 28}`}
                        strokeDashoffset={`${(1 - percent / 100) * 2 * Math.PI * 28}`}
                        transform="rotate(-90 32 32)"
                      />
                    </svg>
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {percent}%
                    </div>
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {m.name}
                    </div>
                    <div style={{ marginTop: 8, height: 8, borderRadius: 999, background: "#e5e7eb", overflow: "hidden" }}>
                      <div
                        style={{
                          height: 8,
                          width: `${percent}%`,
                          background: `linear-gradient(90deg, hsl(${hue},85%,55%), hsl(${(hue + 60) % 360},85%,55%))`,
                          borderRadius: 999,
                          transition: "width .6s ease",
                        }}
                      />
                    </div>
                  </div>

                  {/* 次数胶囊 */}
                  <div
                    style={{
                      padding: "4px 12px",
                      borderRadius: 999,
                      color: "#fff",
                      fontSize: 12,
                      background: `linear-gradient(90deg, hsl(${(hue + 20) % 360},85%,55%), hsl(${(hue + 80) % 360},85%,55%))`,
                      boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {m.value} 次
                  </div>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}