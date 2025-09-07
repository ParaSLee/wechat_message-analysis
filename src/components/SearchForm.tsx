'use client';

import { Card, Select, DatePicker, Button, Space, Typography, Progress, message } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { ChatroomItem } from '@/services/api';

const { Text } = Typography;
const { RangePicker } = DatePicker;

interface SearchFormProps {
  chatrooms: ChatroomItem[];
  selectedChatroom: string[];
  dateRange: [dayjs.Dayjs, dayjs.Dayjs] | null;
  loading: boolean;
  searching: boolean;
  progress: number;
  totalMessages: number;
  onChatroomChange: (value: string[]) => void;
  onDateRangeChange: (dates: [dayjs.Dayjs, dayjs.Dayjs] | null) => void;
  onSearch: () => void;
  onRefresh: () => void;
}

export default function SearchForm({
  chatrooms,
  selectedChatroom,
  dateRange,
  loading,
  searching,
  progress,
  totalMessages,
  onChatroomChange,
  onDateRangeChange,
  onSearch,
  onRefresh,
}: SearchFormProps) {
  const handleSearch = () => {
    if (!selectedChatroom || (Array.isArray(selectedChatroom) && selectedChatroom.length === 0)) {
      message.warning('请选择一个群聊');
      return;
    }

    if (!dateRange) {
      message.warning('请选择时间范围');
      return;
    }

    onSearch();
  };

  return (
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
              onChange={onChatroomChange}
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
              onClick={onRefresh}
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
            onChange={onDateRangeChange}
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
  );
}