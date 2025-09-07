"use client";

import { Card, Typography, Table, Avatar, Tag, Progress, Space } from "antd";

interface Row { name: string; value: number; }
const rows: Row[] = Array.from({ length: 30 }).map((_, i) => ({
  name: `成员${i + 1}`,
  value: Math.round(Math.random() * 120 + 10),
})).sort((a,b)=>b.value-a.value);

export default function DemoD() {
  const max = Math.max(...rows.map(r=>r.value));

  const columns = [
    {
      title: '排名',
      key: 'rank',
      width: 90,
      render: (_: any, __: any, index: number) => {
        const r = index + 1;
        if (r <= 3) {
          return <Tag color={r === 1 ? 'gold' : r === 2 ? 'default' : 'orange'} className="rank-badge">NO.{r}</Tag>;
        }
        return r;
      }
    },
    {
      title: '发言人',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <Space>
          <Avatar>{text.slice(0,1)}</Avatar>
          <span>{text}</span>
        </Space>
      )
    },
    {
      title: '强度',
      key: 'strength',
      render: (_: any, row: Row) => (
        <Progress percent={Math.round((row.value / max) * 100)} showInfo={false} size="small" />
      )
    },
    {
      title: '次数',
      dataIndex: 'value',
      key: 'value',
      sorter: (a: Row, b: Row) => a.value - b.value,
      defaultSortOrder: 'descend' as const,
      width: 120,
    }
  ];

  return (
    <div className="p-6">
      <Typography.Title level={3}>方案D · 紧凑排行榜表格</Typography.Title>
      <Card className="shadow-sm">
        <Table columns={columns} dataSource={rows} rowKey="name" pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
}