<#
  智造未来 - 工业智造管理系统  一键启动
  用法: 在 PowerShell 中执行  .\start-all.ps1
        首次运行或改动后端代码后执行  .\start-all.ps1 -Build
#>
param([switch]$Build)

$ErrorActionPreference = 'Stop'
$root  = $PSScriptRoot
$back  = Join-Path $root '后端代码\FutureService'
$front = Join-Path $root '前端代码\front'
$jar   = Join-Path $back 'target\FutureService-0.0.1-SNAPSHOT.jar'

# 当前 PowerShell 解释器（兼容 Windows PowerShell 5.1 与 PowerShell 7）
$shell = (Get-Process -Id $PID).Path

if ($Build -or -not (Test-Path $jar)) {
  Write-Host '[1/3] 构建后端 (Maven)...' -ForegroundColor Cyan
  Push-Location $back
  mvn -B -DskipTests package
  Pop-Location
} else {
  Write-Host '[1/3] 后端 jar 已存在，跳过构建' -ForegroundColor DarkGray
}

if (-not (Test-Path (Join-Path $front 'node_modules'))) {
  Write-Host '[2/3] 安装前端依赖 (pnpm)...' -ForegroundColor Cyan
  Push-Location $front
  $env:ELECTRON_SKIP_BINARY_DOWNLOAD = '1'
  pnpm install --config.package-manager-strict=false
  Pop-Location
} else {
  Write-Host '[2/3] 前端依赖已存在，跳过安装' -ForegroundColor DarkGray
}

Write-Host '[3/3] 启动前后端（各开一个窗口，关闭窗口即停止服务）...' -ForegroundColor Cyan
Start-Process -FilePath $shell -ArgumentList @('-NoExit', '-File', (Join-Path $root 'run-backend.ps1'))
Start-Sleep -Seconds 2
Start-Process -FilePath $shell -ArgumentList @('-NoExit', '-File', (Join-Path $root 'run-frontend.ps1'))

Write-Host ''
Write-Host '  前端页面 : http://127.0.0.1:3000/' -ForegroundColor Green
Write-Host '  后端 API : http://127.0.0.1:8080/api/' -ForegroundColor Green
Write-Host '  Swagger  : http://127.0.0.1:8080/api/swagger-ui/index.html' -ForegroundColor Green
Write-Host '  登录方式 : 首次请先「注册」账号，再登录' -ForegroundColor Yellow
Write-Host ''
Write-Host '提示: 后端约需 20-35 秒完成启动。' -ForegroundColor DarkGray
try { Start-Process 'http://127.0.0.1:3000/' } catch { }
