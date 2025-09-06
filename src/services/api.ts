import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5030';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export interface ChatroomItem {
  wxid: string;
  nickname: string;
  remark: string;
}

export interface ContactItem {
  wxid: string;
  nickname: string;
  remark: string;
}

export interface SessionItem {
  talker: string;
  talkerName: string;
  isChatRoom: boolean;
  lastTime: string;
  lastContent: string;
}

export interface ChatlogItem {
  seq: number;
  time: string;
  talker: string;
  talkerName: string;
  isChatRoom: boolean;
  sender: string;
  senderName: string;
  isSelf: boolean;
  type: number;
  subType: number;
  content: string;
}

export interface SenderStats {
  senderName: string;
  count: number;
}

// 模拟数据
const mockChatrooms: ChatroomItem[] = [
  { wxid: 'chatroom1', nickname: '家人群', remark: '家人群' },
  { wxid: 'chatroom2', nickname: '同事群', remark: '同事群' },
  { wxid: 'chatroom3', nickname: '朋友群', remark: '朋友群' },
  { wxid: 'chatroom4', nickname: '同学群', remark: '同学群' },
];

// 获取群聊列表
export const getChatrooms = async (): Promise<ChatroomItem[]> => {
  try {
    const response = await api.get('/api/v1/chatroom');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch chatrooms, using mock data:', error);
    return mockChatrooms;
  }
};

// 获取联系人列表
export const getContacts = async (): Promise<ContactItem[]> => {
  const response = await api.get('/api/v1/contact');
  return response.data;
};

// 获取会话列表
export const getSessions = async (): Promise<SessionItem[]> => {
  const response = await api.get('/api/v1/session');
  return response.data;
};

// 模拟聊天记录数据
const generateMockChatlog = (talker: string, count: number = 100): ChatlogItem[] => {
  const mockSenders = [
    { name: '张三', count: 30 },
    { name: '李四', count: 25 },
    { name: '王五', count: 20 },
    { name: '赵六', count: 15 },
    { name: '钱七', count: 10 },
    { name: '孙八', count: 8 },
    { name: '周九', count: 7 },
    { name: '吴十', count: 5 },
    { name: '郑十一', count: 3 },
    { name: '王十二', count: 2 },
  ];
  
  const result: ChatlogItem[] = [];
  let seq = 1;
  
  // 根据每个发言人的权重生成消息
  mockSenders.forEach(sender => {
    for (let i = 0; i < sender.count; i++) {
      const time = new Date();
      time.setHours(time.getHours() - Math.floor(Math.random() * 24));
      
      result.push({
        seq: seq++,
        time: time.toISOString(),
        talker: talker,
        talkerName: talker === 'chatroom1' ? '家人群' : 
                  talker === 'chatroom2' ? '同事群' : 
                  talker === 'chatroom3' ? '朋友群' : '同学群',
        isChatRoom: true,
        sender: `wxid_${sender.name}`,
        senderName: sender.name,
        isSelf: sender.name === '张三',
        type: 1,
        subType: 0,
        content: `这是${sender.name}的第${i+1}条消息`
      });
    }
  });
  
  // 随机排序
  return result.sort(() => Math.random() - 0.5);
};

// 获取聊天记录
export const getChatlog = async (
  talker: string,
  time: string,
  limit: number = 200,
  offset: number = 0
): Promise<ChatlogItem[]> => {
  try {
    const response = await api.get('/api/v1/chatlog', {
      params: {
        talker,
        time,
        limit,
        offset,
        format: 'json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch chatlog, using mock data:', error);
    const mockData = generateMockChatlog(talker);
    return mockData.slice(offset, offset + limit);
  }
};

// 处理聊天记录，统计每个人的发言次数
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