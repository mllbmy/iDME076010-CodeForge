import { useState, useMemo, useEffect } from 'react';
import { Modal, message, Form } from 'antd';
import dayjs from 'dayjs';
import type { Material, ExtAttr, CategoryNode } from '../types';
import { categoryTreeData } from '../constants';

const generateMaterialData = (): Material[] => {
  const baseMaterials = [
    { partName: '太阳轮', partModel: '模数4，齿数20', category: 'sunGear', categoryPath: '核心传动部件→齿轮类→太阳轮', unit: '件', price: 850, description: '20CrMnTi渗碳淬火，齿面硬度58-62HRC', supplier: '齿轮加工车间' },
    { partName: '行星轮', partModel: '模数4，齿数18', category: 'planetGear', categoryPath: '核心传动部件→齿轮类→行星轮', unit: '件', price: 750, description: '20CrMnTi渗碳淬火，3个/套', supplier: '齿轮加工车间' },
    { partName: '内齿圈', partModel: '模数4，齿数56', category: 'ringGear', categoryPath: '核心传动部件→齿轮类→内齿圈', unit: '件', price: 1200, description: '42CrMo调质处理，硬度32-40HRC', supplier: '齿轮加工车间' },
    { partName: '行星架', partModel: '中心距80mm', category: 'planetCarrier', categoryPath: '核心传动部件→行星架', unit: '件', price: 950, description: 'QT700-2球墨铸铁，高强度', supplier: '箱体加工车间' },
    { partName: '输入轴', partModel: 'φ40x200mm', category: 'inputShaft', categoryPath: '轴系部件→输入轴', unit: '根', price: 450, description: '40CrNiMo调质处理', supplier: '箱体加工车间' },
    { partName: '输出轴', partModel: 'φ50x250mm', category: 'outputShaft', categoryPath: '轴系部件→输出轴', unit: '根', price: 550, description: '40CrNiMo调质处理，花键连接', supplier: '箱体加工车间' },
    { partName: '行星轮轴', partModel: 'φ25x80mm', category: 'planetShaft', categoryPath: '轴系部件→行星轮轴', unit: '根', price: 280, description: '40Cr调质处理', supplier: '箱体加工车间' },
    { partName: '滚针轴承', partModel: 'RNA4908', category: 'needleBearing', categoryPath: '支承部件→轴承→滚针轴承', unit: '套', price: 120, description: '行星轮专用滚针轴承', supplier: 'SKF' },
    { partName: '圆柱滚子轴承', partModel: 'NU208', category: 'cylindricalBearing', categoryPath: '支承部件→轴承→圆柱滚子轴承', unit: '套', price: 85, description: '输入轴支承轴承', supplier: 'FAG' },
    { partName: '圆锥滚子轴承', partModel: '32210', category: 'taperedBearing', categoryPath: '支承部件→轴承→圆锥滚子轴承', unit: '套', price: 150, description: '输出轴支承轴承，成对使用', supplier: 'NSK' },
    { partName: '深沟球轴承', partModel: '6208', category: 'deepGrooveBearing', categoryPath: '支承部件→轴承→深沟球轴承', unit: '套', price: 65, description: '通用深沟球轴承', supplier: 'NTN' },
    { partName: '输入壳体', partModel: 'φ180x120mm', category: 'inputHousing', categoryPath: '壳体与箱体部件→输入壳体', unit: '件', price: 650, description: 'QT400-18球墨铸铁', supplier: '箱体加工车间' },
    { partName: '输出壳体', partModel: 'φ200x150mm', category: 'outputHousing', categoryPath: '壳体与箱体部件→输出壳体', unit: '件', price: 750, description: 'QT400-18球墨铸铁', supplier: '箱体加工车间' },
    { partName: '内齿圈壳体', partModel: 'φ220x180mm', category: 'ringGearHousing', categoryPath: '壳体与箱体部件→内齿圈壳体', unit: '件', price: 880, description: 'QT500-7球墨铸铁', supplier: '箱体加工车间' },
    { partName: '法兰盘', partModel: 'φ160mm，4孔', category: 'flange', categoryPath: '壳体与箱体部件→法兰盘', unit: '件', price: 180, description: '45钢，调质处理', supplier: '箱体加工车间' },
    { partName: '氟橡胶油封', partModel: 'φ50x70x10mm', category: 'oilSeal', categoryPath: '辅助部件→密封件→油封', unit: '件', price: 45, description: '氟橡胶，耐油温150°C', supplier: 'NOK' },
    { partName: 'O型圈', partModel: 'φ100x5mm', category: 'oRing', categoryPath: '辅助部件→密封件→O型圈', unit: '件', price: 8, description: '丁腈橡胶', supplier: '国产' },
    { partName: '12.9级螺栓', partModel: 'M10x30mm', category: 'bolt129', categoryPath: '辅助部件→紧固件→12.9级螺栓', unit: '个', price: 3.5, description: '合金钢，发黑处理', supplier: '宁波标准件' },
    { partName: '螺母', partModel: 'M10', category: 'nut', categoryPath: '辅助部件→紧固件→螺母', unit: '个', price: 1.5, description: '8级螺母', supplier: '宁波标准件' },
    { partName: '卡簧', partModel: 'φ50mm', category: 'retainerRing', categoryPath: '辅助部件→紧固件→卡簧', unit: '个', price: 5, description: '65Mn弹簧钢', supplier: '国产' },
    { partName: '定位销', partModel: 'φ8x30mm', category: 'dowelPin', categoryPath: '辅助部件→紧固件→定位销', unit: '个', price: 12, description: 'GCr15淬火', supplier: '国产' },
    { partName: '锁紧环', partModel: 'φ60mm', category: 'lockingRing', categoryPath: '辅助部件→调整件→锁紧环', unit: '件', price: 65, description: '45钢，调质', supplier: '箱体加工车间' },
    { partName: '调整套', partModel: 'φ55x20mm', category: 'adjustingSleeve', categoryPath: '辅助部件→调整件→调整套', unit: '件', price: 45, description: '45钢', supplier: '箱体加工车间' },
    { partName: '调整垫片', partModel: '0.1mm-0.5mm', category: 'shim', categoryPath: '辅助部件→调整件→垫片', unit: '套', price: 25, description: '不锈钢，10片/套', supplier: '国产' },
    { partName: '油杯', partModel: 'M6', category: 'oilCup', categoryPath: '辅助部件→润滑系统→油杯', unit: '个', price: 15, description: '压注油杯', supplier: '国产' },
    { partName: '油嘴', partModel: 'M8', category: 'oilNozzle', categoryPath: '辅助部件→润滑系统→油嘴', unit: '个', price: 10, description: '直通式油嘴', supplier: '国产' },
    { partName: '20CrMnTi圆钢', partModel: 'φ80mmx1000mm', category: 'steel20CrMnTi', categoryPath: '原材料→合金钢→20CrMnTi', unit: '千克', price: 28, description: '齿轮专用合金钢', supplier: '宝钢' },
    { partName: '18CrNiMo7-6圆钢', partModel: 'φ90mmx1000mm', category: 'steel18CrNiMo', categoryPath: '原材料→合金钢→18CrNiMo7-6', unit: '千克', price: 45, description: '高端齿轮材料', supplier: '宝钢' },
    { partName: '40CrNiMo圆钢', partModel: 'φ60mmx1000mm', category: 'steel40CrNiMo', categoryPath: '原材料→合金钢→40CrNiMo', unit: '千克', price: 38, description: '轴类材料', supplier: '宝钢' },
    { partName: '42CrMo圆钢', partModel: 'φ100mmx1000mm', category: 'steel42CrMo', categoryPath: '原材料→合金钢→42CrMo', unit: '千克', price: 35, description: '高强度结构钢', supplier: '宝钢' },
    { partName: 'QT400-18铸件', partModel: '定制', category: 'qt400', categoryPath: '原材料→球墨铸铁→QT400-18', unit: '千克', price: 15, description: '球墨铸铁', supplier: '铸造车间' },
    { partName: 'QT700-2铸件', partModel: '定制', category: 'qt700', categoryPath: '原材料→球墨铸铁→QT700-2', unit: '千克', price: 18, description: '高强度球墨铸铁', supplier: '铸造车间' },
    { partName: 'GCr15轴承钢', partModel: 'φ50mmx500mm', category: 'gcr15', categoryPath: '原材料→轴承钢→GCr15', unit: '千克', price: 32, description: '轴承专用钢', supplier: '兴澄特钢' },
    { partName: '合成齿轮油', partModel: 'ISO VG 220', category: 'gearOil', categoryPath: '标准件（外购）→润滑材料→合成齿轮油', unit: '桶', price: 850, description: '20L/桶，重负荷齿轮油', supplier: '壳牌' },
    { partName: '锂基润滑脂', partModel: 'NLGI 2', category: 'grease', categoryPath: '标准件（外购）→润滑材料→锂基润滑脂', unit: '罐', price: 120, description: '1kg/罐，轴承润滑脂', supplier: '美孚' },
    { partName: '轴承端盖', partModel: 'φ80mm', category: 'bearingCover', categoryPath: '支承部件→轴承端盖', unit: '件', price: 95, description: '45钢，调质', supplier: '箱体加工车间' },
    { partName: '标准轴承', partModel: '6308', category: 'standardBearing', categoryPath: '标准件（外购）→轴承', unit: '套', price: 75, description: '深沟球轴承', supplier: 'SKF' },
    { partName: '标准密封件', partModel: 'TC型', category: 'standardSeal', categoryPath: '标准件（外购）→密封件', unit: '件', price: 35, description: '骨架油封', supplier: 'NOK' },
  ];

  const materials: Material[] = [];
  for (let i = 0; i < 60; i++) {
    const base = baseMaterials[i % baseMaterials.length];
    const idx = Math.floor(i / baseMaterials.length) + 1;
    materials.push({
      key: String(i + 1),
      partNumber: `MAT-${String(i + 1).padStart(3, '0')}`,
      partName: idx > 1 ? `${base.partName}-${idx}` : base.partName,
      partModel: base.partModel,
      stockQuantity: Math.floor(Math.random() * 500) + 20,
      safetyStock: Math.floor(Math.random() * 100) + 30,
      supplier: base.supplier,
      category: base.category,
      categoryPath: base.categoryPath,
      version: 'V1.0',
      status: Math.random() > 0.15 ? '正常' : '预警',
      unit: base.unit,
      price: base.price,
      description: base.description,
      extAttrMap: [{ key: '材质', value: '合金钢' }],
      lastUpdateTime: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    });
  }
  return materials;
};

const useMaterialData = () => {
  const [materialData, setMaterialData] = useState<Material[]>(generateMaterialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<Material | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const [stockStatusFilter, setStockStatusFilter] = useState<string>('');
  const [extAttrs, setExtAttrs] = useState<ExtAttr[]>([]);
  const [form] = Form.useForm();
  const [categories, setCategories] = useState<CategoryNode[]>(categoryTreeData);

  useEffect(() => {
    if (isModalOpen) {
      if (isEditMode && selectedRecord) {
        form.setFieldsValue({ ...selectedRecord });
      } else {
        form.resetFields();
      }
    }
  }, [isModalOpen, isEditMode, selectedRecord, form]);

  const warningMaterials = useMemo(() => {
    return materialData.filter(m => m.stockQuantity <= m.safetyStock);
  }, [materialData]);

  const filteredMaterialData = useMemo(() => {
    let filtered = materialData;

    if (selectedCategory) {
      filtered = filtered.filter(m => m.category === selectedCategory);
    }

    if (searchText) {
      filtered = filtered.filter(m =>
        (m.partNumber || '').toLowerCase().includes(searchText.toLowerCase()) ||
        (m.partName || '').toLowerCase().includes(searchText.toLowerCase()) ||
        (m.partModel || '').toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (stockStatusFilter) {
      if (stockStatusFilter === 'warning') {
        filtered = filtered.filter(m => m.stockQuantity <= m.safetyStock);
      } else {
        filtered = filtered.filter(m => m.status === stockStatusFilter);
      }
    }

    return filtered;
  }, [materialData, selectedCategory, searchText, stockStatusFilter]);

  const getCurrentPageData = (data: Material[]) => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  };

  const getCategoryPath = (categoryValue: string): string => {
    const findPath = (nodes: CategoryNode[], path: string[]): string | null => {
      for (const node of nodes) {
        const currentPath = [...path, node.title];
        if (node.value === categoryValue) {
          return currentPath.join('→');
        }
        if (node.children) {
          const result = findPath(node.children, currentPath);
          if (result) return result;
        }
      }
      return null;
    };
    return findPath(categories, []) || '';
  };

  const handleAdd = () => {
    setIsEditMode(false);
    setSelectedRecord(null);
    setExtAttrs([]);
    setIsModalOpen(true);
  };

  const handleEdit = (record: Material) => {
    setIsEditMode(true);
    setSelectedRecord(record);
    setExtAttrs(record.extAttrMap || []);
    setIsModalOpen(true);
  };

  const handleDelete = (key: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个物料吗？',
      onOk: () => {
        setMaterialData(prev => prev.filter(item => item.key !== key));
        message.success('删除成功');
      }
    });
  };

  const handleRefresh = () => {
    message.success('刷新成功');
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  };

  const handleAddExtAttr = () => {
    setExtAttrs([...extAttrs, { key: '', value: '' }]);
  };

  const handleRemoveExtAttr = (index: number) => {
    const newExtAttrs = [...extAttrs];
    newExtAttrs.splice(index, 1);
    setExtAttrs(newExtAttrs);
  };

  const handleExtAttrChange = (index: number, field: 'key' | 'value', value: string) => {
    const newExtAttrs = [...extAttrs];
    newExtAttrs[index][field] = value;
    setExtAttrs(newExtAttrs);
  };

  const handleSubmit = () => {
    form.validateFields().then(values => {
      const categoryPath = getCategoryPath(values.category);

      if (isEditMode && selectedRecord) {
        setMaterialData(prev => prev.map(item =>
          item.key === selectedRecord.key
            ? {
                ...item,
                ...values,
                categoryPath,
                extAttrMap: extAttrs,
                lastUpdateTime: dayjs().format('YYYY-MM-DD'),
                status: values.stockQuantity <= values.safetyStock ? '预警' : '正常'
              }
            : item
        ));
        message.success('编辑成功');
      } else {
        const newMaterial: Material = {
          key: Date.now().toString(),
          ...values,
          categoryPath,
          extAttrMap: extAttrs,
          lastUpdateTime: dayjs().format('YYYY-MM-DD'),
          status: values.stockQuantity <= values.safetyStock ? '预警' : '正常'
        };
        setMaterialData(prev => [...prev, newMaterial]);
        message.success('添加成功');
      }
      setIsModalOpen(false);
    }).catch(info => {
      console.log('Validation failed:', info);
    });
  };

  const handleStock = (record: Material, type: 'in' | 'out') => {
    setSelectedRecord(record);
    return type;
  };

  const updateMaterialStock = (recordKey: string, newStock: number, safetyStock: number) => {
    setMaterialData(prev => prev.map(item =>
      item.key === recordKey
        ? {
            ...item,
            stockQuantity: newStock,
            status: newStock <= safetyStock ? '预警' : '正常'
          }
        : item
    ));
  };

  const updateMaterialVersion = (partNumber: string, newVersion: string) => {
    setMaterialData(prev => prev.map(m =>
      m.partNumber === partNumber
        ? { ...m, version: newVersion, lastUpdateTime: dayjs().format('YYYY-MM-DD') }
        : m
    ));
  };

  return {
    materialData,
    isModalOpen,
    setIsModalOpen,
    isEditMode,
    selectedRecord,
    setSelectedRecord,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    selectedCategory,
    searchText,
    setSearchText,
    stockStatusFilter,
    setStockStatusFilter,
    extAttrs,
    form,
    categories,
    setCategories,
    warningMaterials,
    filteredMaterialData,
    getCurrentPageData,
    handleAdd,
    handleEdit,
    handleDelete,
    handleRefresh,
    handleCategoryChange,
    handleAddExtAttr,
    handleRemoveExtAttr,
    handleExtAttrChange,
    handleSubmit,
    handleStock,
    updateMaterialStock,
    updateMaterialVersion,
    getCategoryPath,
  };
};

export default useMaterialData;
