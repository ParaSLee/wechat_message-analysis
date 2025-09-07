'use client';

import { Card, Table, Typography } from 'antd';
import { SenderStats } from '@/services/api';

const { Title } = Typography;

interface TableDataItem extends SenderStats {
  key: string;
  rank: number;
  percentage: number;
}

interface StatsTableProps {
  data: TableDataItem[];
  title?: string;
  loading?: boolean;
}

export default function StatsTable({ 
  data, 
  title = "发言详细数据", 
  loading = false 
}: StatsTableProps) {
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
      sorter: (a: TableDataItem, b: TableDataItem) => a.count - b.count,
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

  return (
    <Card className="shadow-sm">
      <Title level={4} className="mb-4">{title}</Title>
      <Table 
        columns={columns}
        dataSource={data}
        loading={loading}
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
  );
}