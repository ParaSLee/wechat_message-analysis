'use client';

import { useState, useEffect } from 'react';
import { 
  Layout, 
  Card, 
  Select, 
  DatePicker, 
  Button, 
  Table, 
  Spin, 
  message, 
  Typography, 
  Empty,
  Progress,
  Space
} from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import { 
  getChatrooms, 
  getChatlog, 
  processChatlogStats, 
  ChatroomItem, 
  ChatlogItem, 
  SenderStats 
} from '@/services/api';

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
  useEffect(() => {
    const loadChatrooms = async () => {
      setLoading(true);
      try {
        const data = await getChatrooms();
        setChatrooms(data);
      } catch (error) {
        message.error('获取群聊列表失败，请确保本地服务已启动');
        console.error('Failed to load chatrooms:', error);
      } finally {
        setLoading(false);
      }
    };

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

  // 表格列定义
  const columns = [
    {
      title: '排名',
      key: 'rank',
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: '发言人',
      dataIndex: 'senderName',
      key: 'senderName',
    },
    {
      title: '发言次数',
      dataIndex: 'count',
      key: 'count',
      sorter: (a: SenderStats, b: SenderStats) => a.count - b.count,
      defaultSortOrder: 'descend' as const,
    },
  ];

  // 图表数据
  const chartData = stats.slice(0, 10).map((item) => ({
    name: item.senderName,
    value: item.count,
  }));

  // 随机颜色生成
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'];

  return (
    <Layout className="min-h-screen">
      <Header className="flex items-center bg-white shadow-md">
        <Title level={3} className="m-0 text-blue-600">微信群聊消息统计分析</Title>
      </Header>
      
      <Content className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="mb-6 shadow-sm">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1">
                <Text strong>选择群聊：</Text>
                <Select
                  className="w-full mt-2"
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

          {stats.length > 0 ? (
            <Space direction="vertical" size="large" className="w-full">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card title="发言次数排行榜 Top 10" className="shadow-sm">
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                      data={chartData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 60,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        angle={-45} 
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" name="发言次数">
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card title="发言详细数据" className="shadow-sm">
                  <Table 
                    columns={columns} 
                    dataSource={stats} 
                    rowKey="senderName"
                    pagination={{ pageSize: 10 }}
                  />
                </Card>
              </motion.div>
            </Space>
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
