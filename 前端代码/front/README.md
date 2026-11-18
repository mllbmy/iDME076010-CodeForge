# 工业智造管理系统 (Industrial Intelligent Manufacturing System)

[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-blue)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple)](https://vitejs.dev/)
[![Ant Design](https://img.shields.io/badge/Ant%20Design-5.12-blue)](https://ant.design/)

工业智造管理系统前端项目，涵盖设备管理、物料管理、工序管理、AI实时监控、报表分析等功能模块，具有科幻风格的大屏可视化界面。

---

## 功能模块

- **智能大屏** — 科幻风格首页，实时展示关键指标
- **AI实时监控预警** — 设备状态监控、预警规则配置
- **设备管理** — 设备台账、保养记录、维修记录
- **物料管理** — 物料台账、库存记录、版本管理
- **工序及工艺管理** — 工序配置、工艺路线、工艺参数
- **报表分析** — 设备统计、保养/维修分析、成本分析

---

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | React 18.3 + TypeScript 5.2 |
| 构建 | Vite 5.4 |
| UI库 | Ant Design 5.12 |
| 路由 | React Router 6 |
| 状态 | Zustand 4.5 |
| 图表 | ECharts 5.5（按需引入）|
| HTTP | Axios 1.13 |
| 测试 | Vitest + React Testing Library |

---

## 目录结构

```
src/
├── components/          # 业务组件
│   ├── common/          # 公共组件（Logo、StatusTag、ErrorBoundary）
│   ├── material/        # 物料管理（已拆分）
│   ├── equipment/       # 设备管理（已拆分）
│   ├── process/         # 工序管理（已拆分）
│   └── ...
├── services/            # 服务层
│   ├── interfaces/      # Service 接口定义
│   ├── mock/            # Mock 实现
│   ├── real/            # Real API 实现
│   ├── adapters/        # 数据适配器
│   └── registry.ts      # 服务注册中心
├── store/               # Zustand 状态管理
├── utils/               # 工具函数
├── router/              # 路由配置
├── api/                 # 后端 API 定义
└── __tests__/           # 单元测试
```

---

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发模式（Mock 数据）

```bash
pnpm dev
```

访问 http://localhost:3000

### 联调模式（真实后端）

```bash
pnpm dev:real
```

需配置 `.env.development.real` 中的 `VITE_API_BASE_URL`。

### 生产构建

```bash
pnpm build
```

### 运行测试

```bash
pnpm test          # 监听模式
pnpm test:run      # 单次运行
pnpm test:coverage # 覆盖率报告
```

### 代码检查

```bash
pnpm lint          # ESLint
pnpm format        # Prettier 格式化
pnpm format:check  # Prettier 检查
```

---

## 环境变量

| 变量 | 说明 | 示例 |
|------|------|------|
| `VITE_API_MODE` | API 模式：mock / real | `mock` |
| `VITE_API_BASE_URL` | API 基础地址 | `http://localhost:8080/api` |
| `VITE_APP_TITLE` | 应用标题 | `工业智造管理系统` |
| `VITE_MOCK_DELAY` | Mock 延迟（ms）| `300` |

---

## API 切换机制

项目实现了 Mock / Real API 的无缝切换：

1. **Mock 模式**（默认）：使用 `services/mock/` 下的本地实现
2. **Real 模式**：使用 `services/real/` 调用真实后端 API

切换方式：修改 `VITE_API_MODE` 环境变量，业务代码无需修改。

详见 [API 过渡架构设计](docs/api-transition-architecture.md)

---

## 文档

- [项目分析报告](docs/project-analysis-report.md)
- [P0 重构计划](docs/p0-refactor-plan.md)
- [P1 重构计划](docs/p1-refactor-plan.md)
- [P2 重构计划](docs/p2-refactor-plan.md)
- [P3 重构计划](docs/p3-refactor-plan.md)
- [项目审查报告](docs/project-review-report.md)
- [API 过渡架构](docs/api-transition-architecture.md)

---

## License

MIT
