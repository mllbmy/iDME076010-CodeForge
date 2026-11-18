# 「智」造未来 —— 工业智造管理系统

面向精密行星减速器等**多品种、小批量、高精度**制造场景的工艺与生产资源管理系统，基于华为 **iDME + xDM-F** 数据建模引擎构建。

- 团队编号 / 名称：iDME076010 / CodeForge
- 参赛赛项：工业 miniAPP 开发赛项
- 技术栈：React 18 + TypeScript + Vite 5 + Ant Design 5 + ECharts ｜ Spring Boot 3.0 + JDK 17 ｜ 华为 iDME / xDM-F

## 功能模块

| 模块 | 主要能力 |
| --- | --- |
| 智能大屏 | 关键指标、产能对比与设备状态可视化总览 |
| AI 智能中心 | 设备运行实时监控、异常预警与处理建议 |
| 设备管理 | 设备台账、保养记录、维修记录、折旧与设备类型管理 |
| 物料管理 | 物料台账、BOM 结构维护、库存出入库与版本管理 |
| 工序及工艺 | 标准工序库、工艺路线可视化编排、工艺参数配置 |
| 报表分析 | 设备、保养、维修与成本的多维统计分析 |

## 目录结构

```
.
├── 前端代码/front/          # React 单页应用（Vite）
│   ├── src/components/      # 业务组件（设备 / 物料 / 工序 / AI / 区块链）
│   ├── src/services/        # Mock 与 Real 双数据实现
│   └── electron/            # Electron 桌面端入口
├── 后端代码/FutureService/  # Spring Boot 服务
│   └── src/main/java/       # 控制器 / 配置 / 异常处理
├── start-all.ps1            # Windows 一键启动
└── README.md
```

## 快速开始

### 环境要求

JDK 17+、Node.js 18+、pnpm、Maven。

### 前端（Mock 数据模式，可独立运行）

```bash
cd 前端代码/front
pnpm install
pnpm dev            # http://localhost:3000
```

首次进入需先「注册」账号：账号为 **10 位数字**，密码需含数字、字母与符号（如 `Abc@1234`）。

### 后端

```bash
cd 后端代码/FutureService
mvn -DskipTests package
java -jar target/FutureService-0.0.1-SNAPSHOT.jar   # http://localhost:8080/api
```

- 接口文档：http://localhost:8080/api/swagger-ui/index.html
- 演示登录接口：`admin / 123456`

### 一键启动（Windows）

```powershell
.\start-all.ps1          # 日常启动
.\start-all.ps1 -Build   # 修改后端代码后重建
```

## 配置说明

后端连接 iDME 的账号参数和密码**不写入仓库**，通过环境变量注入：

```powershell
$env:IDME_PASSWORD = "<你的 iDME 密码>"
$env:IDME_USER_NAME = "<你的 iDME 用户名>"
$env:IDME_SUB_APP_ID = "<你的子应用 ID>"
$env:IDME_DOMAIN_NAME = "<你的租户 ID>"
```

其余 iDME 连接参数见 `后端代码/FutureService/src/main/resources/application.yaml`。区块链示例网络的 `crypto-config` 含私钥，未纳入公开仓库；使用真实 Fabric 网络时需自行配置证书与密钥。
接入真实数据还需要在本地启动 iDME 服务代理（默认 `http://127.0.0.1:8003`）。

## 数据模式

前端支持 Mock / Real 两种模式，通过 `.env` 中的 `VITE_API_MODE` 切换：

- `mock`（默认）：使用内置模拟数据，**无需后端即可完整演示**
- `real`：调用真实后端接口

## 在线演示（GitHub Pages）

仓库内置工作流 `.github/workflows/deploy-pages.yml`，推送到 `main` 后自动构建前端并发布。

启用步骤：仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**，
等待 Actions 完成后即可通过以下地址访问：

```
https://<你的用户名>.github.io/<仓库名>/
```

> 注意：Pages 只托管**前端**（Mock 数据模式），后端 Spring Boot 服务需另行部署。

## 关于仓库体积

为保证仓库可克隆，以下内容**未纳入版本库**（见 `.gitignore`）：

- `front.zip` / `FutureService.zip` 原始压缩包
- `node_modules/`、`target/`、`dist/`、Electron 打包产物 `dist-electron-*/`

## License

MIT
