import { SenderStats, ChatlogItem } from '@/services/api';

/**
 * 处理聊天记录，统计每个人的发言次数
 */
export const processChatlogStats = (chatlog: ChatlogItem[]): SenderStats[] => {
  const senderMap = new Map<string, number>();

  chatlog.forEach((item) => {
    const sender = item.senderName;
    if (sender) {
      senderMap.set(sender, (senderMap.get(sender) || 0) + 1);
    }
  });

  // 转换为数组并排序
  const result: SenderStats[] = Array.from(senderMap.entries()).map(([senderName, count]) => ({
    senderName,
    count,
  }));

  // 按发言次数降序排序
  result.sort((a, b) => b.count - a.count);

  return result;
};

/**
 * 为表格数据添加排名和百分比
 */
export const addRankingAndPercentage = (stats: SenderStats[], totalMessages: number) => {
  return stats.map((item, index) => ({
    ...item,
    key: item.senderName,
    rank: index + 1,
    percentage: totalMessages > 0 ? (item.count / totalMessages) * 100 : 0,
  }));
};

/**
 * 转换数据格式为排行榜组件所需的格式
 */
export const convertToRankingData = (stats: SenderStats[]) => {
  return stats.map((item) => ({
    name: item.senderName,
    value: item.count,
  }));
};

/**
 * 转换数据格式为图表组件所需的格式（取前N名）
 */
export const convertToChartData = (stats: SenderStats[], topN: number = 10) => {
  return stats.slice(0, topN).map((item, index) => ({
    name: item.senderName,
    count: item.count,
    rank: index + 1,
  }));
};

/**
 * 格式化日期范围为API所需的格式
 */
export const formatDateRange = (dateRange: [any, any] | null): string => {
  if (!dateRange) return '2020-01-01,2030-12-31';
  
  const startDate = dateRange[0].format('YYYY-MM-DD');
  const endDate = dateRange[1].format('YYYY-MM-DD');
  return `${startDate}~${endDate}`;
};

/**
 * 获取群聊ID（处理数组和字符串格式）
 */
export const getChatroomId = (selectedChatroom: string | string[]): string => {
  return Array.isArray(selectedChatroom) ? selectedChatroom[0] : selectedChatroom;
};