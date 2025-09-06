## 📖 项目简介
wechat_message_analysis 是基于 [chatlog 项目](https://github.com/sjzar/chatlog) 实现的微信聊天记录分析工具。

### ✨ 支持能力
1. 获取聊天记录
2. 识别群聊中的水群王者

## 🚀 项目启动
### 🔧 前置条件


在使用 wechat_message_analysis 之前，您需要先安装并运行 [chatlog](https://github.com/sjzar/chatlog) 后端服务：

> ⚠️注意⚠️
> chatlog 会有封号风险，请注意账号安全
> 不推荐在 mac 上运行，windows 上使用相对风险更小（本人在 mac 上已被封过 1 次）

#### 1. 安装 Chatlog 项目

```bash
# 方式一：从源码安装
go install github.com/sjzar/chatlog@latest

# 方式二：下载预编译版本
# 访问 https://github.com/sjzar/chatlog/releases
```

#### 2. 获取微信数据密钥并解密

```bash
# 启动 Terminal UI 界面
chatlog

# 或使用命令行模式
chatlog key     # 获取密钥
chatlog decrypt # 解密数据
```

#### 3. 启动 HTTP API 服务

```bash
# 启动服务（默认端口 5030）
chatlog server

# 验证服务状态
curl http://127.0.0.1:5030/api/v1/session
```

> 📖 详细步骤请参考 [chatlog 官方文档](https://github.com/sjzar/chatlog)


### ⚡ 前端运行

#### 安装依赖

```bash
# 使用 npm
npm install

# 使用 yarn
yarn install

# 使用 pnpm
pnpm install
```

#### 启动开发服务器

```bash
# 开发模式（默认端口 8080）
npm run dev

# 使用 yarn
yarn dev

# 使用 pnpm
pnpm dev

# 访问应用
open http://localhost:3000
```

## 📄 许可证

本项目基于 [Apache License 2.0](LICENSE) 开源协议。

## 🙏 致谢

- [chatlog](https://github.com/sjzar/chatlog) - 强大的聊天记录后端服务
- [React](https://react.dev/) - 渐进式JavaScript框架
