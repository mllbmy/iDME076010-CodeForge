import React from 'react';
import { Result, Button } from 'antd';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  retryCount: number;
}

const MAX_RETRY = 3;
const isChunkLoadError = (error: Error | null) =>
  error?.name === 'ChunkLoadError' ||
  error?.message?.includes('Failed to fetch dynamically imported module') ||
  error?.message?.includes('Loading chunk');

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null, retryCount: 0 };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  handleReset = () => {
    if (isChunkLoadError(this.state.error) && this.state.retryCount < MAX_RETRY) {
      this.setState(prev => ({ hasError: false, error: null, errorInfo: null, retryCount: prev.retryCount + 1 }));
    } else {
      this.setState({ hasError: false, error: null, errorInfo: null, retryCount: 0 });
    }
  };

  handleHardReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      const isChunkError = isChunkLoadError(this.state.error);
      const canRetry = isChunkError && this.state.retryCount < MAX_RETRY;
      return (
        <Result
          status="error"
          title={isChunkError ? '页面加载失败' : '页面出现错误'}
          subTitle={isChunkError ? '模块加载失败，可能是网络问题，请尝试重新加载' : (this.state.error?.message || '未知错误')}
          extra={[
            <Button key="retry" type="primary" onClick={this.handleReset}>
              {canRetry ? '重新加载' : '重试'}
            </Button>,
            isChunkError && (
              <Button key="reload" onClick={this.handleHardReload}>
                刷新页面
              </Button>
            ),
            <Button key="home" onClick={() => (window.location.href = '/')}>
              返回首页
            </Button>,
          ]}
        >
          {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
            <details style={{ whiteSpace: 'pre-wrap', marginTop: 16, textAlign: 'left' }}>
              <summary style={{ cursor: 'pointer', color: '#1890ff' }}>错误详情</summary>
              <pre style={{ fontSize: 12, color: '#666' }}>
                {this.state.error?.stack}
                {'\n\nComponent Stack:'}
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </Result>
      );
    }
    return this.props.children;
  }
}
