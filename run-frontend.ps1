# 启动前端 Vite 开发服务器 (端口 3000, Mock 数据模式)
Set-Location (Join-Path $PSScriptRoot '前端代码\front')
$env:npm_config_package_manager_strict = 'false'
Write-Host 'Starting frontend on http://127.0.0.1:3000/ ...' -ForegroundColor Cyan
pnpm dev --host 127.0.0.1
