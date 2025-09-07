"use client";

import { useMemo } from "react";
import { Card, Typography, Row, Col } from "antd";
import { getBadgeByRank } from "./BadgeSVG";
// import BadgeEffect from "./BadgeEffect"; // 4-6名徽章效果组件，需要时可取消注释使用

// 排行榜数据项类型
export interface RankingItem {
  name: string;
  value: number;
}

// 排行榜组件属性
interface RankingBoardProps {
  data: RankingItem[];
  title?: string;
  subtitle?: string;
  maxItems?: number;
}

export const RankingBoard = ({ 
  data, 
  title = "活跃排行榜", 
  subtitle = "Top3 采用领奖台布局并配合彩色徽章强调名次；Top4+ 采用玻璃拟态卡片。",
  maxItems = 12 
}: RankingBoardProps) => {
  // 处理数据：排序并限制数量
  const sortedData = useMemo(() => {
    return [...data]
      .sort((a, b) => b.value - a.value)
      .slice(0, maxItems);
  }, [data, maxItems]);

  const max = useMemo(() => Math.max(...sortedData.map((d) => d.value)), [sortedData]);

  const podium = sortedData.slice(0, 3);
  const others = sortedData.slice(3);

  return (
    <div className="glass-bg w-full max-w-full overflow-x-hidden p-6">
      <div className="mb-6">
        <Typography.Title level={3} style={{ marginBottom: 12 }}>
          {title}
        </Typography.Title>
        <Typography.Paragraph type="secondary" style={{ marginTop: 0, marginBottom: 0 }}>
          {subtitle}
        </Typography.Paragraph>
      </div>

      {/* 领奖台 - TOP3 */}
      <Card style={{ marginBottom: 32, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} title="活跃 TOP 3">
        <Row gutter={[16, 16]}>
          {podium.map((item, idx) => {
            const rank = idx + 1;
            const cls = rank === 1 ? 'podium-gold' : rank === 2 ? 'podium-silver' : 'podium-bronze';
            return (
              <Col key={item.name} xs={24} md={8}>
                <div className={cls} style={{ borderRadius: 8, padding: 20, position: "relative" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                       <div style={{ transform: "scale(0.8)" }}>
                         {getBadgeByRank(rank)}
                       </div>
                       <div>
                         <div style={{ fontSize: 18, fontWeight: 600 }}>{item.name}</div>
                         <div style={{ opacity: 0.9 }}>发言 {item.value} 次</div>
                       </div>
                     </div>
                    <div style={{ fontSize: 32, fontWeight: 800 }}>NO.{rank}</div>
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
       </Card>
 
       {/* 玻璃拟态列表 - TOP4+ */}
       {others.length > 0 && (
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
           {others.map((item, idx) => {
             const rank = idx + 4;
             // const showBadge = rank <= 6; // 4-6名徽章效果已注释
             const percent = Math.round((item.value / max) * 100);
             return (
               <div key={item.name} style={{ position: "relative" }}>
                 <div className="glass-card p-6 relative overflow-visible">
                   <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                     <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
                       {/* 4-6名徽章效果已注释，如需使用请取消下面的注释并导入BadgeEffect组件 */}
                       {/* <BadgeEffect rank={rank} showBadge={rank <= 6} /> */}
                       <div style={{ flex: 1, minWidth: 0 }}>
                         <div style={{ fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: "#0f172a" }}>
                           {item.name}
                         </div>
                         <div style={{ marginTop: 8, height: 8, background: "rgba(255,255,255,.55)", borderRadius: 999, overflow: "hidden" }}>
                           <div
                             style={{
                               height: 8,
                               width: `${percent}%`,
                               background: "linear-gradient(90deg,#60A5FA,#F472B6)",
                               borderRadius: 999,
                               transition: "width .6s ease",
                             }}
                           />
                         </div>
                         <div style={{ marginTop: 6, fontSize: 12, color: "#334155" }}>发言次数：{item.value}</div>
                       </div>
                     </div>
                     <div style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", flexShrink: 0, marginLeft: 12 }}>NO.{rank}</div>
                   </div>
                 </div>
               </div>
             );
           })}
         </div>
       )}
    </div>
  );
};

export default RankingBoard;