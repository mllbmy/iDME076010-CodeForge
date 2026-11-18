import { Component } from 'react';
import { Result, Button } from 'antd';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class AiErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Result
          status="warning"
          title="AI功能异常"
          subTitle="AI功能出现错误，不影响其他功能使用"
          extra={<Button type="primary" onClick={() => this.setState({ hasError: false })}>重新加载</Button>}
        />
      );
    }
    return this.props.children;
  }
}
