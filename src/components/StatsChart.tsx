'use client';

import { Card, Typography } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const { Title } = Typography;

interface ChartDataItem {
  name: string;
  count: number;
  rank: number;
}

interface StatsChartProps {
  data: ChartDataItem[];
  title?: string;
  height?: number;
}

export default function StatsChart({ 
  data, 
  title = "发言次数排行榜 (Top 10)", 
  height = 400 
}: StatsChartProps) {
  return (
    <Card className="shadow-sm">
      <Title level={4} className="mb-4 text-center">{title}</Title>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
  );
}