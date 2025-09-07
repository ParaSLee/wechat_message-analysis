/**
 * Mock数据生成工具函数
 * 用于demos中统一的数据生成，避免重复代码
 */

// 种子随机数生成器（确保SSR/CSR一致性）
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * 生成模拟的排行榜数据
 * @param count 数据条数
 * @param seed 随机种子
 * @param minValue 最小值
 * @param maxValue 最大值
 * @returns 排序后的模拟数据
 */
export function generateMockRankingData(
  count: number = 12,
  seed: number = 77,
  minValue: number = 20,
  maxValue: number = 200
) {
  const rand = mulberry32(seed);
  const data = Array.from({ length: count }).map((_, i) => ({
    name: `成员${i + 1}`,
    value: Math.round(rand() * (maxValue - minValue) + minValue),
  }));
  
  return data.sort((a, b) => b.value - a.value);
}

/**
 * 为不同的demo页面预设的数据配置
 */
export const DEMO_CONFIGS = {
  a: { count: 12, seed: 100, minValue: 20, maxValue: 140 },
  b: { count: 12, seed: 200, minValue: 50, maxValue: 200 },
  c: { count: 12, seed: 300, minValue: 20, maxValue: 120 },
  d: { count: 30, seed: 400, minValue: 10, maxValue: 130 },
  e: { count: 12, seed: 500, minValue: 40, maxValue: 200 },
  f: { count: 12, seed: 600, minValue: 30, maxValue: 180 },
  g: { count: 12, seed: 2025, minValue: 80, maxValue: 280 },
} as const;

/**
 * 根据demo类型生成对应的数据
 * @param demoType demo类型 (a-g)
 * @returns 生成的模拟数据
 */
export function generateDemoData(demoType: keyof typeof DEMO_CONFIGS) {
  const config = DEMO_CONFIGS[demoType];
  return generateMockRankingData(config.count, config.seed, config.minValue, config.maxValue);
}