"use client";

import { getBadgeByRank } from "./BadgeSVG";

// 4-6名徽章效果组件
// 这个组件包含了4-6名的徽章显示逻辑，可以在需要时单独使用
// 
// 原始在RankingBoard中的代码逻辑：
// const showBadge = rank <= 6;
// {showBadge && (
//   <div style={{ transform: "scale(0.8)", flexShrink: 0 }}>
//     {getBadgeByRank(rank)}
//   </div>
// )}
//
// 使用方法：
// 1. 在RankingBoard.tsx中取消注释：import BadgeEffect from "./BadgeEffect";
// 2. 在需要显示徽章的地方使用：<BadgeEffect rank={rank} showBadge={rank <= 6} />

export interface BadgeEffectProps {
  rank: number;
  showBadge?: boolean;
}

export const BadgeEffect = ({ rank, showBadge = true }: BadgeEffectProps) => {
  if (!showBadge || rank > 6) {
    return null;
  }

  return (
    <div style={{ transform: "scale(0.8)", flexShrink: 0 }}>
      {getBadgeByRank(rank)}
    </div>
  );
};

export default BadgeEffect;