'use client';

import { useState, useEffect } from 'react';
import { 
  Layout, 
  Card, 
  Select, 
  DatePicker, 
  Button, 
  Spin, 
  message, 
  Typography, 
  Empty,
  Progress,
  Table,
  Space
} from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import dayjs from 'dayjs';
import { 
  getChatrooms, 
  getChatlog, 
  processChatlogStats, 
  ChatroomItem, 
  ChatlogItem, 
  SenderStats 
} from '@/services/api';
import RankingBoard, { RankingItem } from '@/components/RankingBoard';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

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
    if (!selectedChatroom || (Array.isArray(selectedChatroom) && selectedChatroom.length === 0)) {
      message.warning('请选择一个群聊');
      return;
    }

    if (!dateRange) {
      message.warning('请选择时间范围');
      return;
    }

    setSearching(true);
    setProgress(0);
    setStats([]);
    setTotalMessages(0);

    const startDate = dateRange[0].format('YYYY-MM-DD');
    const endDate = dateRange[1].format('YYYY-MM-DD');
    const timeRange = `${startDate}~${endDate}`;

    // 获取实际的群聊ID
    const chatroomId = Array.isArray(selectedChatroom) ? selectedChatroom[0] : selectedChatroom;

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

  // 转换数据格式为排行榜组件所需的格式
  const rankingData: RankingItem[] = stats.map((item) => ({
    name: item.senderName,
    value: item.count,
  }));

  // 表格列定义
  const columns = [
    {
      title: '排名',
      dataIndex: 'rank',
      key: 'rank',
      width: 80,
      render: (text: number) => (
        <span className="font-bold text-blue-600">#{text}</span>
      ),
    },
    {
      title: '发言人',
      dataIndex: 'senderName',
      key: 'senderName',
      render: (text: string) => (
        <span className="font-medium">{text}</span>
      ),
    },
    {
      title: '发言次数',
      dataIndex: 'count',
      key: 'count',
      sorter: (a: SenderStats, b: SenderStats) => a.count - b.count,
      render: (text: number) => (
        <span className="text-green-600 font-semibold">{text.toLocaleString()}</span>
      ),
    },
    {
      title: '占比',
      dataIndex: 'percentage',
      key: 'percentage',
      render: (text: number) => (
        <span className="text-purple-600">{text.toFixed(2)}%</span>
      ),
    },
  ];

  // 为表格数据添加排名和百分比
  const tableData = stats.map((item, index) => ({
    ...item,
    key: item.senderName,
    rank: index + 1,
    percentage: totalMessages > 0 ? (item.count / totalMessages) * 100 : 0,
  }));

  // 图表数据（取前10名）
  const chartData = stats.slice(0, 10).map((item, index) => ({
    name: item.senderName,
    count: item.count,
    rank: index + 1,
  }));

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

          <Card className="shadow-sm">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1">
                <Text strong>选择群聊：</Text>
                <Space.Compact className="w-full mt-2">
                  <Select
                    className="flex-1"
                    placeholder="请选择群聊"
                    loading={loading}
                    value={selectedChatroom}
                    onChange={setSelectedChatroom}
                    options={Array.isArray(chatrooms) ? chatrooms.map((item) => ({
                      label: item.nickname || item.wxid,
                      value: item.wxid,
                    })) : []}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    mode="tags"
                    allowClear
                  />
                  <Button 
                    icon={<ReloadOutlined />} 
                    onClick={loadChatrooms}
                    loading={loading}
                    title="刷新群聊列表"
                  >
                    刷新
                  </Button>
                </Space.Compact>
              </div>
              
              <div className="flex-1">
                <Text strong>选择时间范围：</Text>
                <RangePicker 
                  className="w-full mt-2" 
                  value={dateRange}
                  onChange={(dates) => setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
                />
              </div>
              
              <Button 
                type="primary" 
                onClick={handleSearch} 
                loading={searching}
                className="h-10"
              >
                确认
              </Button>
            </div>
            
            {searching && (
              <div className="mt-4">
                <Text>正在加载数据，已获取 {totalMessages} 条消息</Text>
                <Progress percent={progress} status="active" />
              </div>
            )}
          </Card>
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
              
              {/* 原本的图表展示 */}
              <div className='mb-8'>

              <Card className="shadow-sm">
                <Title level={4} className="mb-4 text-center">发言次数排行榜 (Top 10)</Title>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      interval={0}
                    />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => [value.toLocaleString(), '发言次数']}
                      labelFormatter={(label: string) => `发言人: ${label}`}
                    />
                    <Legend />
                    <Bar 
                      dataKey="count" 
                      fill="#3b82f6" 
                      name="发言次数"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
              </div>
              
              {/* 原本的表格展示 */}
              <Card className="shadow-sm">
                <Title level={4} className="mb-4">发言详细数据</Title>
                <Table 
                  columns={columns}
                  dataSource={tableData}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => 
                      `第 ${range[0]}-${range[1]} 条，共 ${total} 条记录`,
                  }}
                  scroll={{ x: 600 }}
                  size="middle"
                />
              </Card>
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
