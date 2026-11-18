import React from 'react';
import type { FormInstance } from 'antd';
import StockInForm from './StockInForm';

interface StockOutFormProps {
  visible: boolean;
  form: FormInstance;
  stockType: 'in' | 'out';
  onSubmit: () => void;
  onCancel: () => void;
}

const StockOutForm: React.FC<StockOutFormProps> = (props) => {
  return <StockInForm {...props} />;
};

export default StockOutForm;
