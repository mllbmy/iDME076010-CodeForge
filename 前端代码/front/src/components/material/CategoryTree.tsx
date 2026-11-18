import React from 'react';
import { Tree, Space, Button } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { CategoryNode } from './types';

interface CategoryTreeProps {
  categories: CategoryNode[];
  onEditCategory: (node: CategoryNode) => void;
  onDeleteCategory: (node: CategoryNode) => void;
}

const CategoryTree: React.FC<CategoryTreeProps> = ({ categories, onEditCategory, onDeleteCategory }) => {
  const renderCategoryTree = (nodes: CategoryNode[]): React.ReactNode => {
    return nodes.map(node => (
      <Tree.TreeNode
        key={node.key}
        title={
          <Space>
            {node.icon}
            <span>{node.title}</span>
            <Space size="small">
              <Button
                type="link"
                size="small"
                icon={<EditOutlined />}
                onClick={(e) => { e.stopPropagation(); onEditCategory(node); }}
              />
              <Button
                type="link"
                size="small"
                danger
                icon={<DeleteOutlined />}
                onClick={(e) => { e.stopPropagation(); onDeleteCategory(node); }}
              />
            </Space>
          </Space>
        }
      >
        {node.children && renderCategoryTree(node.children)}
      </Tree.TreeNode>
    ));
  };

  return <Tree defaultExpandAll>{renderCategoryTree(categories)}</Tree>;
};

export default CategoryTree;
