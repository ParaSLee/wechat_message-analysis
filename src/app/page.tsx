'use client';

import { useState, useEffect } from 'react';
import { Layout, Typography, Empty, message, Card } from 'antd';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import { 
  getChatrooms, 
  getChatlog, 
  ChatroomItem, 
  ChatlogItem, 
  SenderStats 
} from '@/services/api';
import { 
  processChatlogStats,
  addRankingAndPercentage,
  convertToRankingData,
  convertToChartData,
  formatDateRange,
  getChatroomId
} from '@/utils/dataUtils';
import RankingBoard, { RankingItem } from '@/components/RankingBoard';
import SearchForm from '@/components/SearchForm';
import StatsChart from '@/components/StatsChart';
import StatsTable from '@/components/StatsTable';

const { Header, Content } = Layout;
const { Title } = Typography;

export default function Home() {
  // 状态管理
  const [chatrooms, setChatrooms] = useState<ChatroomItem[]>([]);
  const [selectedChatroom, setSelectedChatroom] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [searching, setSearching] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [stats, setStats] = useState<SenderStats[]>([]);
  const [totalMessages, setTotalMessages] = useState<number>(0);
  
  // 加载群聊列表
  const loadChatrooms = async () => {
    setLoading(true);
    try {
      const data = await getChatrooms();
      setChatrooms(data);
      message.success(`成功获取 ${data.length} 个群聊`);
    } catch (error) {
      message.error('获取群聊列表失败，请确保本地服务已启动');
      console.error('Failed to load chatrooms:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChatrooms();
  }, []);

  // 处理搜索按钮点击
  const handleSearch = async () => {
    setSearching(true);
    setProgress(0);
    setStats([]);
    setTotalMessages(0);

    const timeRange = formatDateRange(dateRange);
    const chatroomId = getChatroomId(selectedChatroom);

    try {
      let allMessages: ChatlogItem[] = [];
      let offset = 0;
      let hasMore = true;
      
      // 循环获取所有消息
      while (hasMore) {
        const messages = await getChatlog(chatroomId, timeRange, 200, offset);
        if (messages.length === 0) {
          hasMore = false;
        } else {
          allMessages = [...allMessages, ...messages];
          offset += messages.length;
          setProgress(Math.min(100, Math.floor((allMessages.length / 1000) * 100)));
          setTotalMessages(allMessages.length);
        }
      }

      if (allMessages.length === 0) {
        message.info('未找到符合条件的聊天记录');
        setStats([]);
      } else {
        // 处理统计数据
        const statsData = processChatlogStats(allMessages);
        setStats(statsData);
      }
    } catch (error) {
      message.error('获取聊天记录失败');
      console.error('Failed to load chatlog:', error);
    } finally {
      setSearching(false);
      setProgress(100);
    }
  };

  // 转换数据格式
  const rankingData: RankingItem[] = convertToRankingData(stats);
  const tableData = addRankingAndPercentage(stats, totalMessages);
  const chartData = convertToChartData(stats, 10);

  return (
    <Layout className="min-h-screen">
      <Header className="flex items-center bg-white shadow-md">
        <Title level={3} className="m-0 text-blue-600">微信群聊消息统计分析</Title>
      </Header>
      
      <Content className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-12"
        >
          <div className='mb-8'>
            <SearchForm
              chatrooms={chatrooms}
              selectedChatroom={selectedChatroom}
              dateRange={dateRange}
              loading={loading}
              searching={searching}
              progress={progress}
              totalMessages={totalMessages}
              onChatroomChange={setSelectedChatroom}
              onDateRangeChange={(dates) => setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
              onSearch={handleSearch}
              onRefresh={loadChatrooms}
            />
          </div>

          {stats.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="mb-8 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <RankingBoard 
                  data={rankingData}
                  title="群聊活跃度排行榜"
                  subtitle="基于发言次数统计的群成员活跃度排名，Top3 采用领奖台布局并配合彩色徽章强调名次；Top4+ 采用玻璃拟态卡片。"
                  maxItems={12}
                />
              </div>
              
              {/* 图表展示 */}
              <div className='mb-8'>
                <StatsChart data={chartData} />
              </div>
              
              {/* 表格展示 */}
              <StatsTable data={tableData} />
            </motion.div>
          ) : !searching && (
            <Card className="text-center py-12">
              <Empty description="暂无数据，请选择群聊和时间范围进行查询" />
            </Card>
          )}
        </motion.div>
      </Content>
    </Layout>
  );
}
