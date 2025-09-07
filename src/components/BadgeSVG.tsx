"use client";

import { useId } from "react";

// 徽章类型定义
export type Variant = "gray" | "emerald" | "gold" | "green" | "pink" | "silver";

interface BadgeConfig {
  outerGlow: string;
  mainGradient: [string, string];
  innerGlow: string;
  ribbonLeftGradient?: [string, string];
  ribbonRightGradient?: [string, string];
  starColor: string;
  sparkles: boolean;
}

export const BadgeSVG = ({ variant = "gold" }: { variant?: Variant }) => {
  const configs: Record<Variant, BadgeConfig> = {
    // 第一名 - 粉橙渐变徽章（图片第二行第三列）
    gold: {
      outerGlow: "rgba(255, 143, 171, 0.6)",
      mainGradient: ["#FF8FAB", "#FB923C"],
      innerGlow: "rgba(255, 255, 255, 0.4)",
      ribbonLeftGradient: ["#F472B6", "#EC4899"],
      ribbonRightGradient: ["#A78BFA", "#8B5CF6"],
      starColor: "#FFFFFF",
      sparkles: true
    },
    // 第二名 - 紫色渐变徽章（图片第二行第二列）
    silver: {
      outerGlow: "rgba(167, 139, 250, 0.5)",
      mainGradient: ["#A78BFA", "#7C3AED"],
      innerGlow: "rgba(255, 255, 255, 0.3)",
      ribbonLeftGradient: ["#F5F3FF", "#C4B5FD"],
      ribbonRightGradient: ["#ECE9FE", "#A78BFA"],
      starColor: "#FFFFFF",
      sparkles: true
    },
    // 第三名 - 蓝色渐变徽章（图片第二行第一列）
    emerald: {
      outerGlow: "rgba(96, 165, 250, 0.5)",
      mainGradient: ["#60A5FA", "#2563EB"],
      innerGlow: "rgba(255, 255, 255, 0.3)",
      ribbonLeftGradient: ["#F0F9FF", "#BFDBFE"],
      ribbonRightGradient: ["#EFF6FF", "#93C5FD"],
      starColor: "#FFFFFF",
      sparkles: true
    },
    // 保持原有的其他颜色
    pink: {
      outerGlow: "rgba(249, 168, 212, 0.6)",
      mainGradient: ["#F9A8D4", "#EC4899"],
      innerGlow: "rgba(255, 255, 255, 0.4)",
      ribbonLeftGradient: ["#FBCFE8", "#DB2777"],
      ribbonRightGradient: ["#F9A8D4", "#BE185D"],
      starColor: "#FFFFFF",
      sparkles: false
    },
    green: {
      outerGlow: "rgba(52, 211, 153, 0.4)",
      mainGradient: ["#34D399", "#059669"],
      innerGlow: "rgba(255, 255, 255, 0.3)",
      ribbonLeftGradient: ["#6EE7B7", "#10B981"],
      ribbonRightGradient: ["#34D399", "#059669"],
      starColor: "#FFFFFF",
      sparkles: false
    },
    gray: {
      outerGlow: "rgba(156, 163, 175, 0.5)",
      mainGradient: ["#9CA3AF", "#4B5563"],
      innerGlow: "rgba(255, 255, 255, 0.3)",
      ribbonLeftGradient: ["#E5E7EB", "#6B7280"],
      ribbonRightGradient: ["#D1D5DB", "#374151"],
      starColor: "#FFFFFF",
      sparkles: false
    }
  };
  
  const config = configs[variant];
  const uid = useId();
  const uniqueId = `${variant}-${uid}`;
  
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" style={{ filter: `drop-shadow(0 4px 12px ${config.outerGlow})`, position: "relative", zIndex: 100 }}>
      <defs>
        {/* 外层光晕 */}
        <radialGradient id={`outer-glow-${uniqueId}`} cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor={config.outerGlow} />
          <stop offset="70%" stopColor={config.outerGlow.replace(/[\d\.]+\)$/,'0.2)')} />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        {/* 主体渐变 */}
        <radialGradient id={`main-gradient-${uniqueId}`} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor={config.mainGradient[0]} />
          <stop offset="100%" stopColor={config.mainGradient[1]} />
        </radialGradient>
        {/* 内层高光 */}
        <radialGradient id={`inner-glow-${uniqueId}`} cx="50%" cy="30%" r="40%">
          <stop offset="0%" stopColor={config.innerGlow} />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        {/* 左/右 丝带渐变 */}
        <linearGradient id={`ribbon-left-gradient-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={config.ribbonLeftGradient?.[0] || '#fff'} />
          <stop offset="100%" stopColor={config.ribbonLeftGradient?.[1] || '#ddd'} />
        </linearGradient>
        <linearGradient id={`ribbon-right-gradient-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={config.ribbonRightGradient?.[0] || '#fff'} />
          <stop offset="100%" stopColor={config.ribbonRightGradient?.[1] || '#ddd'} />
        </linearGradient>
        {/* 星形高光 */}
        <radialGradient id={`star-glow-${uniqueId}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.3)" />
        </radialGradient>

        {/* 阴影滤镜 */}
        <filter id={`ribbon-shadow-${uniqueId}`} x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="rgba(0,0,0,0.35)" />
        </filter>
        <filter id={`star-shadow-${uniqueId}`} x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="rgba(0,0,0,0.25)" />
        </filter>
      </defs>
      
      {/* 外层光晕圆 */}
      <circle cx="28" cy="28" r="27" fill={`url(#outer-glow-${uniqueId})`} opacity="0.8" />
      
      {/* 放射光束（在圆环后面）*/}
      {['gold','silver','emerald'].includes(variant) && (
        <g opacity="0.25" stroke={config.mainGradient[1]} strokeWidth="2" strokeLinecap="round">
          <line x1="28" y1="5" x2="28" y2="10" />
          <line x1="13" y1="11" x2="16" y2="15" />
          <line x1="43" y1="11" x2="40" y2="15" />
          <line x1="8" y1="28" x2="12" y2="28" />
          <line x1="44" y1="28" x2="48" y2="28" />
          <line x1="13" y1="45" x2="16" y2="41" />
          <line x1="43" y1="45" x2="40" y2="41" />
        </g>
      )}
      
      {/* 主体圆环 */}
      <circle cx="28" cy="28" r="22" fill={`url(#main-gradient-${uniqueId})`} stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
      
      {/* 内层装饰圆环 */}
      <circle cx="28" cy="28" r="18" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
      
      {/* 内层高光 */}
      <circle cx="28" cy="28" r="16" fill={`url(#inner-glow-${uniqueId})`} />
      
      {/* 中心白色圆 */}
      <circle cx="28" cy="28" r="12" fill="rgba(255,255,255,0.95)" />
      
      {/* 星形图标（放在圆环之上，略微放大以覆盖到圆环边缘） */}
      <path
        d="M28 18l3.2 6.4 7.1 1-5.1 5 1.2 7-6.4-3.4-6.4 3.4 1.2-7-5.1-5 7.1-1L28 18z"
        fill={`url(#star-glow-${uniqueId})`}
        stroke={config.mainGradient[1]}
        strokeWidth="0.5"
        filter={`url(#star-shadow-${uniqueId})`}
        transform="translate(28 28) scale(1.12) translate(-28 -28)"
      />

      {/* 星芒光束（覆盖在圆环之上并延伸到外部）*/}
      <g opacity="0.6" stroke="rgba(255,255,255,0.95)" strokeWidth="1.3" strokeLinecap="round" pointerEvents="none" filter={`url(#star-shadow-${uniqueId})`}>
        <line x1="28" y1="12" x2="28" y2="6" />
        <line x1="28" y1="50" x2="28" y2="46" />
        <line x1="12" y1="28" x2="6" y2="28" />
        <line x1="50" y1="28" x2="46" y2="28" />
        <line x1="16" y1="16" x2="12" y2="12" />
        <line x1="40" y1="16" x2="44" y2="12" />
        <line x1="16" y1="40" x2="12" y2="44" />
        <line x1="40" y1="40" x2="44" y2="44" />
      </g>
 
      {/* 丝带装饰（覆盖在圆环之上并延伸到外部） */}
      {['gold','silver','emerald'].includes(variant) && (
        <g filter={`url(#ribbon-shadow-${uniqueId})`}>
          {/* 中央丝带带身，略微包覆圆环下沿 */}
          <path
            d="M20 41 C24 39, 32 39, 36 41 L36 44 C32 42.5, 24 42.5, 20 44 Z"
            fill={`url(#ribbon-left-gradient-${uniqueId})`} opacity="0.95"
          />
          {/* 左侧丝带尾巴（V 形缺口）*/}
          <path
            d="M22 44 L26 42 L26 54 L24 51 L22 54 Z"
            fill={`url(#ribbon-left-gradient-${uniqueId})`}
          />
          {/* 右侧丝带尾巴（V 形缺口）*/}
          <path
            d="M30 42 L34 44 L34 54 L32 51 L30 54 Z"
            fill={`url(#ribbon-right-gradient-${uniqueId})`}
          />
          {/* 丝带高光描边 */}
          <path d="M22 44 L26 42" stroke="rgba(255,255,255,0.65)" strokeWidth="0.6" />
          <path d="M34 44 L30 42" stroke="rgba(255,255,255,0.65)" strokeWidth="0.6" />
        </g>
      )}
 
       {/* 闪光效果 */}
       {config.sparkles && (
         <g opacity="0.8">
           <circle cx="18" cy="18" r="1" fill="rgba(255,255,255,0.9)">
             <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
           </circle>
           <circle cx="38" cy="22" r="0.8" fill="rgba(255,255,255,0.8)">
             <animate attributeName="opacity" values="0.2;0.9;0.2" dur="1.5s" repeatCount="indefinite" begin="0.5s" />
           </circle>
           <circle cx="42" cy="35" r="1.2" fill="rgba(255,255,255,0.7)">
             <animate attributeName="opacity" values="0.4;1;0.4" dur="1.8s" repeatCount="indefinite" begin="1s" />
           </circle>
           <circle cx="15" cy="38" r="0.6" fill="rgba(255,255,255,0.9)">
             <animate attributeName="opacity" values="0.2;0.8;0.2" dur="2.2s" repeatCount="indefinite" begin="0.3s" />
           </circle>
         </g>
       )}
     </svg>
   );
 } 

// 缩小版徽章组件
export const SmallerBadgeSVG = ({ variant, scale = 0.8 }: { variant: Variant, scale?: number }) => {
  return (
    <div style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}>
      <BadgeSVG variant={variant} />
    </div>
  );
};

// 根据排名获取对应徽章的函数
export const getBadgeByRank = (rank: number) => {
  switch (rank) {
    case 1:
      return <BadgeSVG variant="gold" />;
    case 2:
      return <BadgeSVG variant="silver" />;
    case 3:
      return <BadgeSVG variant="emerald" />;
    case 4:
      return <SmallerBadgeSVG variant="pink" scale={0.8} />;
    case 5:
      return <SmallerBadgeSVG variant="green" scale={0.8} />;
    case 6:
      return <SmallerBadgeSVG variant="gray" scale={0.8} />;
    default:
      return null;
  }
};