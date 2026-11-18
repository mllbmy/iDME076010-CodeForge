import React from 'react';

export interface ExtAttr {
  key: string;
  value: string;
}

export interface Material {
  key: string;
  partNumber: string;
  partName: string;
  partModel: string;
  stockQuantity: number;
  safetyStock: number;
  supplier: string;
  category: string;
  categoryPath: string;
  version: string;
  status: string;
  unit: string;
  price: number;
  description: string;
  extAttrMap: ExtAttr[];
  lastUpdateTime: string;
}

export interface StockRecord {
  key: string;
  materialId: string;
  materialName: string;
  type: 'in' | 'out';
  quantity: number;
  relatedOrder: string;
  operator: string;
  operateTime: string;
  remark: string;
  beforeStock: number;
  afterStock: number;
  blockchainCertified?: boolean;
  blockchainTxHash?: string;
}

export interface VersionRecord {
  key: string;
  version: string;
  materialId: string;
  name: string;
  change: string;
  date: string;
  person: string;
}

export interface CategoryNode {
  key: string;
  title: string;
  value: string;
  icon?: React.ReactNode;
  children?: CategoryNode[];
}
