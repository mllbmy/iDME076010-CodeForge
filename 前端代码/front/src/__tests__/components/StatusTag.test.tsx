import { render, screen } from '@testing-library/react';
import { StatusTag } from '@/components/common';

describe('StatusTag', () => {
  it('renders equipment running status with green color', () => {
    render(<StatusTag status="运行中" type="equipment" />);
    const tag = screen.getByText('运行中');
    expect(tag).toBeInTheDocument();
    expect(tag.closest('.ant-tag')).toHaveClass('ant-tag-green');
  });

  it('renders material active status with text override', () => {
    render(<StatusTag status="active" type="material" />);
    expect(screen.getByText('在用')).toBeInTheDocument();
  });

  it('renders unknown status with default color', () => {
    render(<StatusTag status="未知" type="equipment" />);
    expect(screen.getByText('未知')).toBeInTheDocument();
  });
});
