# 启动后端 Spring Boot (端口 8080, context-path /api)
Set-Location (Join-Path $PSScriptRoot '后端代码\FutureService')
Write-Host 'Starting backend on http://127.0.0.1:8080/api/ ...' -ForegroundColor Cyan
java -jar 'target\FutureService-0.0.1-SNAPSHOT.jar'
