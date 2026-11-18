import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import './index.css'

// 统一使用 HashRouter：静态托管（GitHub Pages / 后端 static）无需服务端路由回退，
// 部署在任意子路径下都能访问，刷新页面也不会 404。
const Router = HashRouter

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
    </Router>
  </React.StrictMode>,
)
