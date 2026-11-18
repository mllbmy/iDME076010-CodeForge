# Electron 桌面应用开发计划

> **项目名称**: 工业智造管理系统 (Industrial Intelligent Manufacturing System)
> **版本**: v1.0.0-Electron
> **日期**: 2026-05-15
> **状态**: 规划阶段

---

## 📋 目录

1. [项目现状分析](#一项目现状分析)
2. [Electron 集成方案](#二electron-集成方案)
3. [技术选型与架构设计](#三技术选型与架构设计)
4. [分阶段实施计划](#四分阶段实施计划)
5. [风险评估与应对策略](#五风险管理与应对策略)
6. [性能优化策略](#六性能优化策略)
7. [测试策略](#七测试策略)
8. [部署与发布](#八部署与发布)

---

## 一、项目现状分析

### 1.1 技术栈概览

| 层级 | 技术 | 版本 | 兼容性评估 |
|------|------|------|-----------|
| **框架** | React | 18.3.1 | ✅ 完全兼容 |
| **语言** | TypeScript | 5.2.2 | ✅ 完全兼容 |
| **构建工具** | Vite | 5.4.0 | ⚠️ 需要适配 |
| **UI 库** | Ant Design | 5.12.8 | ✅ 完全兼容 |
| **路由** | React Router DOM | 6.21.0 | ✅ 需要适配 HashRouter |
| **状态管理** | Zustand | 4.5.0 | ✅ 完全兼容 |
| **HTTP 客户端** | Axios | 1.13.6 | ✅ 需要适配 IPC |
| **图表库** | ECharts | 5.5.4 | ✅ 完全兼容 |
| **包管理器** | pnpm | 8.15.0 | ✅ 推荐使用 |

### 1.2 项目架构分析

```
src/
├── api/                    # API 接口定义层 (15个文件)
├── components/             # React 组件 (50+ 组件)
│   ├── ai/                # AI 功能模块 (13个组件)
│   ├── blockchain/        # 区块链模块 (6个组件)
│   ├── equipment/         # 设备管理 (12个组件)
│   ├── material/          # 物料管理 (10个组件)
│   ├── process/           # 工序管理 (12个组件)
│   └── common/            # 公共组件 (4个组件)
├── services/              # 服务层 (核心架构)
│   ├── interfaces/        # 服务接口定义 (14个接口)
│   ├── mock/              # Mock 实现 (15个服务)
│   ├── real/              # 真实 API 实现 (15个服务)
│   ├── adapters/          # 数据适配器 (8个)
│   └── registry.ts        # 服务注册中心
├── store/                 # 状态管理 (6个 Store)
├── router/                # 路由配置
├── data/                  # 优先数据集 (2个文件)
└── utils/                 # 工具函数 (6个)
```

### 1.3 核心功能模块

#### 页面结构（6个主要页面）
1. **智能大屏** (`/dashboard`) - SciFiDashboard
2. **AI 智能中心** (`/ai-monitoring`) - AIRealTimeMonitoring
3. **设备管理** (`/equipment`) - EquipmentManagement
4. **物料管理** (`/material`) - MaterialManagement
5. **工序及工艺管理** (`/process`) - ProcessManagement
6. **报表分析** (`/reports`) - ReportsAnalysis

### 1.4 数据流架构

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   React UI  │────▶│  Zustand    │────▶│  Services   │
│ Components  │◀────│  Stores     │◀────│  Layer      │
└─────────────┘     └─────────────┘     └─────────────┘
       │                                      │
       ▼                                      ▼
┌─────────────┐                       ┌─────────────┐
│   Router    │                       │  API/Mock   │
│ (HashMode)  │                       │  Data Source│
└─────────────┘                       └─────────────┘
                                              │
                    ┌─────────────────────────┤
                    │                         │
              ┌─────▼─────┐           ┌──────▼──────┐
              │  Mock Mode │           │  Real API   │
              │ (本地数据) │           │ (HTTP请求)  │
              └───────────┘           └─────────────┘
```

---

## 二、Electron 集成方案

### 2.1 集成模式选择

#### 方案对比

| 方案 | 描述 | 优点 | 缺点 | 适用场景 |
|------|------|------|------|---------|
| **A: electron-builder** | 直接打包现有 Web 应用 | 改动最小，快速上线 | 无法使用原生能力 | 快速原型、演示版本 |
| **B: electron-vite** | 深度集成，主进程+渲染进程分离 | 架构清晰，可扩展性强 | 改动较大，学习成本高 | 长期维护、功能丰富 |
| **C: Tauri** (替代方案) | Rust 后端 + Web 前端 | 体积小，安全性高 | 需要学习 Rust | 追求极致性能 |

#### **推荐方案：B - electron-vite**

**选择理由**：
1. ✅ 与现有 Vite 项目完美集成
2. ✅ 支持 TypeScript 原生开发
3. ✅ 主进程/渲染进程分离，架构清晰
4. ✅ 内置热更新（HMR）支持
5. ✅ 社区活跃，文档完善
6. ✅ 可渐进式增强原生能力

### 2.2 目标架构设计

```
electron-app/
├── electron.vite.config.ts      # Electron Vite 配置
├── package.json                  # 更新依赖和脚本
├── resources/                    # 应用资源
│   └── icon.ico                  # 应用图标
├── src/
│   ├── main/                     # 🔵 主进程 (Main Process)
│   │   ├── index.ts              # 主入口
│   │   ├── ipc/                  # IPC 通信处理
│   │   │   ├── api.ts            # API 代理
│   │   │   ├── file.ts           # 文件操作
│   │   │   └── system.ts         # 系统调用
│   │   ├── services/             # 主进程服务
│   │   │   ├── updater.ts        # 自动更新
│   │   │   ├── tray.ts           # 系统托盘
│   │   │   └── window.ts         # 窗口管理
│   │   └── utils/                # 工具函数
│   │       └── logger.ts         # 日志系统
│   │
│   ├── preload/                  # 🟡 预加载脚本 (Preload)
│   │   └── index.ts              # 安全桥接层
│   │
│   └── renderer/                 # 🟢 渲染进程 (Renderer) ← 现有代码
│       ├── src/                  # 复用现有 src/
│       │   ├── main.tsx          # 修改为 HashRouter
│       │   ├── App.tsx           # 添加 Electron 适配
│       │   └── ...               # 其他代码不变
│       └── index.html            # 入口 HTML
│
├── out/                          # 构建输出目录
│   └── ...                       # 打包后的应用
└── release/                      # 发布产物
    └── ...                       # 安装包
```

---

## 三、技术选型与架构设计

### 3.1 核心依赖清单

```json
{
  "dependencies": {
    "electron": "^28.0.0",
    "electron-store": "^8.1.0",
    "electron-log": "^5.0.0",
    "electron-updater": "^6.1.0",
    "electron-is-dev": "^2.0.0"
  },
  "devDependencies": {
    "electron-vite": "^2.0.0",
    "electron-builder": "^24.9.0",
    "@electron-toolkit/preload": "^3.0.0",
    "@electron-toolkit/utils": "^3.0.0",
    "vite-plugin-electron": "^0.28.0",
    "vite-plugin-electron-renderer": "^0.14.5"
  }
}
```

### 3.2 关键适配点详解

#### 3.2.1 路由适配（BrowserRouter → HashRouter）

**问题**: Electron 使用 `file://` 协议，不支持 History 模式路由

**解决方案**:
```typescript
// src/main.tsx (修改前)
import { BrowserRouter } from 'react-router-dom'
<BrowserRouter>
  <App />
</BrowserRouter>

// src/main.tsx (修改后)
import { HashRouter } from 'react-router-dom'
// 检测是否在 Electron 环境
const isElectron = navigator.userAgent.includes('Electron')
const Router = isElectron ? HashRouter : BrowserRouter

<Router>
  <App />
</Router>
```

#### 3.2.2 API 请求适配

**当前实现**:
```typescript
// src/utils/request.ts
const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';
```

**Electron 适配方案**:
```typescript
// 通过 IPC 通信桥接 HTTP 请求到主进程
if (window.electronAPI) {
  // Electron 环境：使用 IPC 通信
  const response = await window.electronAPI.invoke('api-request', {
    url, method, data, params
  });
} else {
  // Web 环境：使用 axios 直接请求
  const response = await instance({ url, method, data, params });
}
```

**IPC 通信流程**:
```
渲染进程 (Renderer)          主进程 (Main)
     │                            │
     │  window.electronAPI.invoke  │
     │  ('api-request', config)    │
     ├──────────────────────────▶  │
     │                            │  axios.request(config)
     │                            │  (绕过 CORS)
     │                            ◀──────────────────┤
     │  Promise.resolve(data)     │
     │                            │
```

#### 3.2.3 存储适配

**当前实现**: `localStorage`

**问题**:
- localStorage 在 Electron 中容量限制（通常 5MB）
- 数据持久化不可靠（用户清除缓存会丢失）

**解决方案**: 使用 `electron-store`
```typescript
// 主进程 - electron-store
import Store from 'electron-store';
const store = new Store({
  name: 'industrial-system-data',
  defaults: {
    userSettings: {},
    token: '',
    currentUser: null,
    cachedData: {}
  }
});

// 预加载脚本暴露给渲染进程
contextBridge.exposeInMainWorld('electronStore', {
  get: (key) => store.get(key),
  set: (key, value) => store.set(key, value),
  delete: (key) => store.delete(key),
});
```

#### 3.2.4 文件系统访问

**新增能力**: 导入/导出 Excel、PDF 报表等

```typescript
// 主进程 - 文件操作 IPC
ipcMain.handle('file:save-dialog', async (_event, options) => {
  const result = await dialog.showSaveDialog(options);
  return result;
});

ipcMain.handle('file:write', async (_event, filePath, data) => {
  await fs.writeFile(filePath, data);
  return true;
});

// 渲染进程使用
const savePath = await window.electronAPI.invoke('file:save-dialog', {
  title: '导出报表',
  defaultPath: 'report.xlsx',
  filters: [{ name: 'Excel', extensions: ['xlsx'] }]
});

if (!savePath.canceled) {
  await window.electronAPI.invoke('file:write', savePath.filePath, excelData);
}
```

### 3.3 新增桌面端专属功能

#### 3.3.1 系统托盘 (System Tray)
- 最小化到托盘
- 右键菜单快捷操作
- 未读消息提醒图标

#### 3.3.2 自动更新 (Auto Updater)
- 检测新版本
- 下载进度显示
- 安装后重启

#### 3.3.3 本地数据库 (可选)
- SQLite 存储离线数据
- 数据同步机制
- 大批量数据处理

#### 3.3.4 窗口管理
- 多窗口支持（子页面独立窗口）
- 窗口状态记忆（位置、大小）
- 全屏切换
- 开发者工具快捷键

---

## 四、分阶段实施计划

### Phase 1: 基础搭建（预计 3-5 天）

**目标**: 让项目能在 Electron 中运行

#### 任务清单:
- [ ] **Day 1: 环境初始化**
  - [ ] 初始化 electron-vite 项目结构
  - [ ] 配置 package.json 和构建脚本
  - [ ] 创建主进程入口文件
  - [ ] 创建预加载脚本

- [ ] **Day 2: 路由与基础适配**
  - [ ] 将 BrowserRouter 改为条件渲染（Web/Electron）
  - [ ] 修复所有相对路径引用
  - [ ] 配置 CSP（Content Security Policy）
  - [ ] 解决静态资源加载问题

- [ ] **Day 3: 窗口配置**
  - [ ] 配置主窗口属性（大小、标题、图标）
  - [ ] 实现窗口基本控制（关闭、最小化、最大化）
  - [ ] 添加窗口事件处理
  - [ ] 配置开发环境热更新

- [ ] **Day 4-5: 测试与调试**
  - [ ] 所有页面正常渲染
  - [ ] 路由导航正常工作
  - [ ] Mock 数据正常加载
  - [ ] 基本交互无异常

**交付物**:
- ✅ 可运行的 Electron 应用（开发模式）
- ✅ 所有现有功能正常工作
- ✅ 基础窗口管理功能

---

### Phase 2: 核心适配（预计 5-7 天）

**目标**: 实现关键功能的 Electron 原生化

#### 任务清单:

- [ ] **Week 1: 数据层适配**
  - [ ] 实现 IPC 通信框架
  - [ ] 封装 API 请求代理（解决 CORS 问题）
  - [ ] 替换 localStorage 为 electron-store
  - [ ] 实现数据迁移逻辑（从 localStorage 导入旧数据）

- [ ] **Week 2: 文件系统集成**
  - [ ] 实现文件对话框（打开/保存）
  - [ ] 集成 Excel 导出功能（使用原生文件保存）
  - [ ] 实现拖拽上传支持
  - [ ] 添加最近文件列表

**交付物**:
- ✅ 完整的 IPC 通信体系
- ✅ 数据持久化可靠存储
- ✅ 文件操作原生体验

---

### Phase 3: 桌面特性增强（预计 5-7 天）

**目标**: 添加桌面应用特有功能

#### 任务清单:

- [ ] **Week 1: 系统集成**
  - [ ] 实现系统托盘功能
  - [ ] 添加开机自启动选项
  - [ ] 实现全局快捷键
  - [ ] 集成系统通知

- [ ] **Week 2: 高级功能**
  - [ ] 实现自动更新机制
  - [ ] 添加多语言支持（可选）
  - [ ] 实现主题跟随系统
  - [ ] 优化内存占用（按需加载）

**交付物**:
- ✅ 完整的桌面应用体验
- ✅ 系统托盘和通知
- ✅ 自动更新功能

---

### Phase 4: 打包发布（预计 3-5 天）

**目标**: 生成可分发的安装包

#### 任务清单:

- [ ] **Day 1-2: 构建配置**
  - [ ] 配置 electron-builder
  - [ ] 设置应用元信息（名称、版本、描述）
  - [ ] 准备应用图标（Windows .ico, Mac .icns）
  - [ ] 配置数字签名（可选）

- [ ] **Day 3: 多平台打包**
  - [ ] Windows (NSIS 安装包 / Portable)
  - [] macOS (DMG / PKG)
  - [ ] Linux (AppImage / deb / rpm)

- [ ] **Day 4-5: 发布准备**
  - [ ] 编写更新日志
  - [ ] 准备发布说明文档
  - [ ] 配置自动更新服务器
  - [ ] 性能测试和优化

**交付物**:
- ✅ Windows 安装包 (.exe/.msi)
- ✅ macOS 安装包 (.dmg)
- ✅ Linux 安装包 (.AppImage/.deb)
- ✅ 自动更新服务器配置

---

### Phase 5: 优化与维护（持续进行）

**目标**: 长期稳定性和用户体验优化

#### 持续任务:
- [ ] 性能监控与优化
- [ ] 用户反馈收集与改进
- [ ] 安全漏洞修复
- [ ] 依赖版本升级
- [ ] 新功能迭代

---

## 五、风险管理与应对策略

### 5.1 技术风险

| 风险 | 影响 | 概率 | 应对策略 |
|------|------|------|----------|
| **Vite 与 Electron 兼容性** | 高 | 中 | 使用 electron-vite 成熟方案，参考官方示例 |
| **第三方库不兼容** | 中 | 低 | 逐一测试，寻找替代品或 Polyfill |
| **内存泄漏** | 高 | 中 | 使用 Chrome DevTools Profiler 监控，及时释放资源 |
| **CORS 问题** | 中 | 高 | 主进程代理 API 请求，完全规避 |
| **打包体积过大** | 中 | 中 | 代码分割、按需加载、Tree Shaking |

### 5.2 业务风险

| 风险 | 影响 | 概率 | 应对策略 |
|------|------|------|----------|
| **数据迁移失败** | 高 | 低 | 提供导入向导，支持手动迁移 |
| **用户习惯改变** | 中 | 中 | 保持界面一致性，提供过渡指南 |
| **离线功能需求** | 中 | 高 | Phase 3 引入本地数据库支持 |

### 5.3 应急预案

**回退方案**:
- 保留原有 Web 版本完整可用
- Electron 版本作为增量发布
- 提供"返回 Web 版"选项

---

## 六、性能优化策略

### 6.1 启动优化

```typescript
// 1. 延迟加载非关键模块
app.whenReady().then(async () => {
  createWindow(); // 先创建窗口
  await loadNonCriticalModules(); // 异步加载其他模块
});

// 2. 使用白屏过渡页
win.loadFile('splash.html'); // 显示 loading 页
setTimeout(() => win.loadURL(rendererURL), 500); // 500ms 后加载主应用

// 3. 预渲染关键页面
// 使用 vite-plugin-ssr 或类似方案
```

### 6.2 运行时优化

- **虚拟滚动**: 大列表使用 react-window
- **图片懒加载**: 使用 Intersection Observer
- **代码分割**: 路由级别懒加载（已实现）
- **缓存策略**: Service Worker 缓存静态资源
- **内存管理**: 及时销毁不需要的组件和定时器

### 6.3 打包优化

```javascript
// electron-builder 配置
{
  "files": [
    "dist/**/*",
    "!node_modules/**/*", // 排除不必要的文件
  ],
  "asar": true, // 使用 asar 归档
  "compression": "maximum", // 最大压缩
  "removePackageScripts": true, // 移除 scripts 字段减少体积
}
```

**目标指标**:
- Windows 安装包大小: < 150 MB
- 内存占用: < 300 MB (空闲状态)
- 启动时间: < 3 秒
- 首屏渲染: < 2 秒

---

## 七、测试策略

### 7.1 测试类型

| 类型 | 工具 | 覆盖范围 |
|------|------|----------|
| **单元测试** | Vitest + @testing-library/react | 业务逻辑、组件渲染 |
| **E2E 测试** | Playwright / Spectron | 用户流程、跨进程通信 |
| **集成测试** | 自定义 IPC 测试框架 | 主进程与渲染进程交互 |
| **视觉回归** | Percy / Chromatic | UI 一致性检查 |
| **性能测试** | Lighthouse CI / custom | 加载时间、内存占用 |

### 7.2 测试重点场景

- [ ] 应用启动和关闭
- [ ] 所有页面正常渲染
- [ ] API 请求通过 IPC 正常工作
- [ ] 文件导入/导出功能
- [ ] 离线模式降级处理
- [ ] 多窗口场景
- [ ] 系统托盘交互
- [ ] 自动更新流程
- [ ] 数据持久化和恢复
- [ ] 不同操作系统兼容性（Windows/macOS/Linux）

---

## 八、部署与发布

### 8.1 发布渠道

**正式渠道**:
- GitHub Releases（开源项目）
- 企业内网分发（内部使用）
- 应用商店（Microsoft Store / Mac App Store / Snap Store）

**测试渠道**:
- GitHub Actions CI/CD 自动构建
- TestFlight / Beta 版本分发
- 内部测试群

### 8.2 版本管理策略

采用语义化版本 (Semantic Versioning):
- **MAJOR**: 不兼容的 API 变更
- **MINOR**: 向下兼容的功能性新增
- **PATCH**: 向下兼容的问题修正

**版本号格式**: `{APP_VERSION}-electron.{BUILD_NUMBER}`
- 示例: `1.0.0-electron.1`

### 8.3 更新机制

```typescript
// 自动更新配置
autoUpdater.autoDownload = false; // 手动确认下载
autoUpdater.autoInstallOnAppQuit = true; // 退出时安装

// 检查更新频率
setInterval(() => {
  autoUpdater.checkForUpdates();
}, 24 * 60 * 60 * 1000); // 每 24 小时检查一次
```

---

## 九、项目时间线总览

```
Phase 1: ████████████████████░░░░░░░░░░░░░░░░░░░  Day 1-5
Phase 2: ░░░░░░░░░░░░█████████████████████░░░░░░░  Day 6-12
Phase 3: ░░░░░░░░░░░░░░░░░░░░░░█████████████████  Day 13-19
Phase 4: ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░█████████  Day 20-24
Phase 5: ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  Ongoing

总计: 约 3-4 周完成基础版本
后续: 持续优化和维护
```

---

## 十、成功标准

### 必须达成 (Must Have)
- ✅ 所有现有功能在 Electron 中正常运行
- ✅ 应用可以打包为安装包
- ✅ 数据持久化可靠
- ✅ 无明显性能问题

### 应该达成 (Should Have)
- ✅ 系统托盘和通知
- ✅ 自动更新机制
- ✅ 文件操作原生体验
- ✅ 多平台支持（至少 Windows）

### 可以达成 (Could Have)
- ✅ 离线数据同步
- ✅ 多窗口支持
- ✅ 系统主题适配
- ✅ 全局快捷键

### 未来考虑 (Won't Have Now)
- ⏳ 移动端适配（考虑 Tauri Mobile）
- ⏳ 云端协作功能
- ⏳ AI 本地推理（ONNX Runtime）
- ⏳ AR/VR 设备集成

---

## 十一、下一步行动

### 立即开始 (本周)
1. ✅ 创建 `electron-app` 分支
2. ✅ 安装 electron-vite 相关依赖
3. ✅ 搭建基础项目结构
4. ✅ 实现第一个 Hello World Electron 窗口

### 近期计划 (下周)
1. 完成路由适配
2. 实现 IPC 通信框架
3. 适配数据存储层
4. 内部 Alpha 测试

### 中期目标 (本月末)
1. 完成 Phase 1-2
2. 发布 Beta 版本
3. 收集用户反馈
4. 开始 Phase 3 开发

---

## 附录：参考资料

### 官方文档
- [Electron 官方文档](https://www.electronjs.org/docs)
- [electron-vite 文档](https://electron-vite.org/)
- [electron-builder 文档](https://www.electron.build/)

### 最佳实践
- [Electron 安全最佳实践](https://www.electronjs.org/docs/tutorial/security)
- [Electron 性能优化指南](https://www.electronjs.org/docs/tutorial/performance)
- [Context Isolation 说明](https://www.electronjs.org/docs/latest/tutorial/context-isolation)

### 示例项目
- [electron-vite 示例](https://github.com/alex8088/electron-vite-boilerplate)
- [electron-react-boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate)
- [Ant Design Pro with Electron](https://pro.ant.design/)

---

**文档版本**: v1.0
**最后更新**: 2026-05-15
**作者**: AI Assistant
**审核状态**: 待评审

---

> 💡 **提示**: 这是一个完整的 Electron 集成路线图。建议先从 Phase 1 开始，逐步验证每个阶段的可行性。如有任何疑问或需要调整的地方，请随时沟通！
