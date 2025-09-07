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





// 获取群聊列表
export const getChatrooms = async (): Promise<ChatroomItem[]> => {
  try {
    const response = await api.get('/api/v1/chatroom', {
      headers: {
        'Accept': 'application/json'
      },
      params: {
        format: 'json'
      }
    });
    
    // 如果是JSON格式，检查是否有items属性
    if (response.data && response.data.items && Array.isArray(response.data.items)) {
      console.log('API返回JSON格式，包含items数组');
      // 转换API返回的数据格式为ChatroomItem格式
      return response.data.items.map((item: any) => ({
        wxid: item.name || item.userName || item.wxid || '',
        nickname: item.nickName || item.nickname || item.displayName || item.name || '未命名群聊',
        remark: item.remark || item.nickName || item.nickname || item.displayName || item.name || ''
      })).filter(item => item.wxid && item.wxid.trim() !== ''); // 过滤掉空的wxid
    }
    
    // 如果直接是数组格式
    if (Array.isArray(response.data)) {
      return response.data;
    }
    
    console.warn('未知的API响应格式:', response.data);
    return [];
  } catch (error) {
    console.error('Failed to fetch chatrooms:', error);
    return [];
  }
};





// 获取聊天记录
export const getChatlog = async (
  talker: string,
  time: string = '2020-01-01,2030-12-31',
  limit: number = 200,
  offset: number = 0
): Promise<ChatlogItem[]> => {
  try {
    const response = await api.get('/api/v1/chatlog', {
      headers: {
        'Accept': 'application/json'
      },
      params: {
        talker,
        time,
        limit,
        offset,
        format: 'json',
      },
    });
    
    // 如果直接是数组格式（这是实际的API响应格式）
    if (Array.isArray(response.data)) {
      console.log('聊天记录API返回JSON数组格式');
      return response.data;
    }
    
    // 如果是JSON格式，检查是否有items属性
    if (response.data && response.data.items && Array.isArray(response.data.items)) {
      console.log('聊天记录API返回JSON格式，包含items数组');
      return response.data.items;
    }
    
    console.warn('聊天记录API返回未知格式:', response.data);
    return [];
  } catch (error) {
    console.error('Failed to fetch chatlog:', error);
    return [];
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