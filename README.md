# Orderly - 美食订餐平台 / Food Ordering Platform

一个基于React.js前端和Node.js/Express后端的全栈美食订餐和评价Web应用程序，使用Firebase认证和Firestore数据库。

A full-stack food ordering and review web application built with React.js frontend and Node.js/Express backend, using Firebase authentication and Firestore database.

## 功能特性 / Features

- 🔐 **用户认证** / User Authentication (Firebase Auth)
- 📱 **响应式设计** / Responsive Design
- 🌐 **双语界面** / Bilingual Interface (中文/English)
- 🍽️ **菜单浏览** / Menu Browsing
- 🛒 **购物车功能** / Shopping Cart
- 📦 **订单管理** / Order Management
- ⭐ **评价系统** / Rating & Review System
- 👤 **用户个人资料** / User Profile Management
- 🔥 **实时数据** / Real-time Data with Firebase

## 技术栈 / Tech Stack

### 前端 / Frontend
- React.js 18
- React Router DOM
- Tailwind CSS
- Firebase SDK
- Axios

### 后端 / Backend
- Node.js
- Express.js
- Firebase Admin SDK
- CORS
- Dotenv

### 数据库 / Database
- Firebase Firestore
- Firebase Authentication

## 项目结构 / Project Structure

```
orderly/
├── client/                 # React前端应用 / React frontend app
│   ├── public/
│   ├── src/
│   │   ├── components/     # 可重用组件 / Reusable components
│   │   ├── pages/          # 页面组件 / Page components
│   │   ├── context/        # React Context状态管理 / React Context state management
│   │   ├── services/       # API服务 / API services
│   │   └── utils/          # 工具函数 / Utility functions
│   ├── package.json
│   └── tailwind.config.js
├── server/                 # Node.js后端API / Node.js backend API
│   ├── config/             # 配置文件 / Configuration files
│   ├── controllers/        # 业务逻辑控制器 / Business logic controllers
│   ├── middleware/         # 中间件 / Middleware
│   ├── routes/             # API路由 / API routes
│   ├── utils/              # 工具函数 / Utility functions
│   ├── package.json
│   └── index.js
├── shared/                 # 共享代码/类型定义 / Shared code/type definitions
├── package.json
└── README.md
```

## 安装和运行 / Installation and Setup

### 前提条件 / Prerequisites

- Node.js (>= 16.0.0)
- npm (>= 8.0.0)
- Firebase项目 / Firebase Project

### 1. 克隆项目 / Clone the repository

```bash
git clone <your-repository-url>
cd orderly
```

### 2. 安装依赖 / Install dependencies

```bash
# 安装所有依赖 / Install all dependencies
npm run install:all
```

### 3. Firebase配置 / Firebase Configuration

#### 3.1 创建Firebase项目 / Create Firebase Project
1. 访问 [Firebase Console](https://console.firebase.google.com/)
2. 创建新项目 / Create a new project
3. 启用Authentication和Firestore / Enable Authentication and Firestore

#### 3.2 前端配置 / Frontend Configuration
1. 复制 `client/.env.example` 为 `client/.env`
2. 在Firebase控制台获取Web应用配置
3. 更新 `client/.env` 文件中的Firebase配置

```env
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

#### 3.3 后端配置 / Backend Configuration
1. 在Firebase控制台生成服务账户密钥
2. 下载JSON文件并保存为 `server/config/serviceAccountKey.json`
3. 复制 `server/.env.example` 为 `server/.env`
4. 更新环境变量

### 4. 启动应用 / Start the application

#### 开发模式 / Development mode
```bash
# 同时启动前后端开发服务器 / Start both frontend and backend dev servers
npm run dev
```

#### 分别启动 / Start separately
```bash
# 启动后端服务器 / Start backend server
npm run server:dev

# 启动前端应用 / Start frontend app
npm run client:dev
```

### 5. 访问应用 / Access the application

- 前端应用 / Frontend: http://localhost:3000
- 后端API / Backend API: http://localhost:5000

## API端点 / API Endpoints

### 认证 / Authentication
- `GET /api/auth/test` - 测试认证路由
- `GET /api/auth/profile` - 获取用户资料
- `POST /api/auth/logout` - 用户登出

### 菜单 / Menu
- `GET /api/menu` - 获取所有菜单项
- `GET /api/menu/:id` - 获取特定菜单项
- `POST /api/menu` - 创建菜单项（管理员）
- `PUT /api/menu/:id` - 更新菜单项（管理员）
- `DELETE /api/menu/:id` - 删除菜单项（管理员）

### 订单 / Orders
- `GET /api/orders` - 获取用户订单
- `GET /api/orders/:id` - 获取特定订单
- `POST /api/orders` - 创建订单
- `PUT /api/orders/:id/status` - 更新订单状态（管理员）

### 评价 / Reviews
- `GET /api/reviews/item/:itemId` - 获取菜品评价
- `GET /api/reviews/user` - 获取用户评价
- `POST /api/reviews` - 创建评价
- `PUT /api/reviews/:id` - 更新评价
- `DELETE /api/reviews/:id` - 删除评价

## 开发指南 / Development Guide

### 添加新页面 / Adding New Pages
1. 在 `client/src/pages/` 中创建新组件
2. 在 `client/src/App.js` 中添加路由
3. 更新导航栏链接（如需要）

### 添加新API端点 / Adding New API Endpoints
1. 在 `server/routes/` 中创建路由文件
2. 在 `server/index.js` 中注册路由
3. 实现相应的控制器逻辑

### 状态管理 / State Management
- 使用React Context进行全局状态管理
- 认证状态：`AuthContext`
- 购物车状态：`CartContext`

## 部署 / Deployment

### 构建生产版本 / Build for Production
```bash
npm run build
```

### 环境变量 / Environment Variables
确保在生产环境中设置所有必要的环境变量。

## 贡献 / Contributing

1. Fork项目 / Fork the project
2. 创建功能分支 / Create a feature branch
3. 提交更改 / Commit your changes
4. 推送到分支 / Push to the branch
5. 创建Pull Request / Create a Pull Request

## 许可证 / License

本项目采用MIT许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 联系方式 / Contact

- 邮箱 / Email: your-email@example.com
- 项目链接 / Project Link: [https://github.com/your-username/orderly](https://github.com/your-username/orderly)