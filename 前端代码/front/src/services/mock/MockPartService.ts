import type { IPartService, PartFrontendVO, PartQuery } from '../interfaces';
import type { PageRequest, PageResult } from '../interfaces/common';
import { mockDelay } from './mockConfig';
import { PRIORITY_MATERIAL_DATA } from '@/data/priorityMaterialData';

const partTemplates = [
  { partCode: 'GS-001', partName: '齿轮轴', partCategory: '输入轴', material: '20CrMnTi合金钢', specification: 'Φ50×200mm', weight: 2.85, unit: '个', drawingNo: 'DWG-GS-V1.0', status: '启用' },
  { partCode: 'OS-001', partName: '输出轴', partCategory: '输出轴', material: '40CrNiMoA合金钢', specification: 'Φ80×300mm', weight: 5.6, unit: '个', drawingNo: 'DWG-OS-V1.0', status: '启用' },
  { partCode: 'SR-001', partName: '太阳轮', partCategory: '太阳轮', material: '20CrMnTi合金钢', specification: 'M3Z28', weight: 1.2, unit: '个', drawingNo: 'DWG-SR-V1.0', status: '启用' },
  { partCode: 'IR-001', partName: '内齿圈', partCategory: '内齿圈', material: '42CrMo合金钢', specification: 'M3Z72', weight: 8.5, unit: '个', drawingNo: 'DWG-IR-V1.0', status: '启用' },
  { partCode: 'PR-001', partName: '行星轮', partCategory: '齿轮', material: '20CrMnTi合金钢', specification: 'M3Z26', weight: 0.9, unit: '个', drawingNo: 'DWG-PR-V1.0', status: '启用' },
  { partCode: 'BB-001', partName: '深沟球轴承', partCategory: '轴承', material: 'GCr15轴承钢', specification: '6208-2RS', weight: 0.35, unit: '个', drawingNo: 'DWG-BB-V1.0', status: '启用' },
  { partCode: 'TB-001', partName: '圆锥滚子轴承', partCategory: '轴承', material: 'GCr15轴承钢', specification: '30206', weight: 0.28, unit: '个', drawingNo: 'DWG-TB-V1.0', status: '启用' },
  { partCode: 'SL-001', partName: '油封', partCategory: '密封件', material: 'NBR丁腈橡胶', specification: 'TC35×52×7', weight: 0.02, unit: '个', drawingNo: 'DWG-SL-V1.0', status: '启用' },
  { partCode: 'OR-001', partName: 'O型圈', partCategory: '密封件', material: 'NBR丁腈橡胶', specification: 'Φ30×3.5', weight: 0.005, unit: '个', drawingNo: 'DWG-OR-V1.0', status: '启用' },
  { partCode: 'CP-001', partName: '弹性联轴器', partCategory: '联轴器', material: '45钢+铝合金', specification: 'LM-D40', weight: 0.8, unit: '个', drawingNo: 'DWG-CP-V1.0', status: '启用' },
  { partCode: 'HS-001', partName: '减速器壳体', partCategory: '减速器壳体', material: 'HT250灰铸铁', specification: '350×280×200mm', weight: 28, unit: '个', drawingNo: 'DWG-HS-V1.0', status: '启用' },
  { partCode: 'EC-001', partName: '端盖', partCategory: '减速器壳体', material: 'HT250灰铸铁', specification: 'Φ120×15mm', weight: 1.5, unit: '个', drawingNo: 'DWG-EC-V1.0', status: '启用' },
];

function generateMockPartData(): PartFrontendVO[] {
  return partTemplates.map((t, i) => ({
    key: String(i + 1),
    ...t,
  }));
}

function convertPriorityToPartFormat(): PartFrontendVO[] {
  return PRIORITY_MATERIAL_DATA.map(item => ({
    key: item.key,
    partCode: item.partNumber,
    partName: item.partName,
    partCategory: item.category,
    material: item.extAttrMap.find(attr => attr.key === '材质')?.value || '',
    specification: item.description.substring(0, 50),
    weight: parseFloat(item.extAttrMap.find(attr => attr.key === '重量(kg)')?.value || '0'),
    unit: item.unit,
    drawingNo: item.partModel,
    status: item.status,
  }));
}

function paginate<T>(list: T[], page: PageRequest): PageResult<T> {
  const start = (page.curPage - 1) * page.pageSize;
  return {
    list: list.slice(start, start + page.pageSize),
    total: list.length,
    curPage: page.curPage,
    pageSize: page.pageSize,
  };
}

export class MockPartService implements IPartService {
  private partData: PartFrontendVO[] = [];

  constructor() {
    const priorityData = convertPriorityToPartFormat();
    const generatedData = generateMockPartData();
    this.partData = [...priorityData, ...generatedData];
  }

  async getPartList(query: PartQuery, page: PageRequest): Promise<PageResult<PartFrontendVO>> {
    await mockDelay();
    let filtered = [...this.partData];
    if (query.keyword) {
      const kw = query.keyword.toLowerCase();
      filtered = filtered.filter(p => p.partName.toLowerCase().includes(kw) || p.partCode.toLowerCase().includes(kw));
    }
    if (query.partCategory) {
      filtered = filtered.filter(p => p.partCategory === query.partCategory);
    }
    if (query.status) {
      filtered = filtered.filter(p => p.status === query.status);
    }
    if (query.showPriority === true || query.showPriority === undefined) {
      filtered.sort((a, b) => {
        const aPriority = a.key.startsWith('priority-') ? -1 : 0;
        const bPriority = b.key.startsWith('priority-') ? -1 : 0;
        return aPriority - bPriority;
      });
    }
    return paginate(filtered, page);
  }

  async getPartById(id: string): Promise<PartFrontendVO | null> {
    await mockDelay();
    return this.partData.find(p => p.key === id) || null;
  }

  async createPart(data: Partial<PartFrontendVO>): Promise<PartFrontendVO> {
    await mockDelay();
    const newItem: PartFrontendVO = {
      key: String(this.partData.length + 1),
      partCode: data.partCode || `PART-${String(this.partData.length + 1).padStart(3, '0')}`,
      partName: data.partName || '',
      partCategory: data.partCategory || '',
      material: data.material || '',
      specification: data.specification || '',
      weight: data.weight || 0,
      unit: data.unit || '',
      drawingNo: data.drawingNo || '',
      status: data.status || '启用',
    };
    this.partData.push(newItem);
    return newItem;
  }

  async updatePart(id: string, data: Partial<PartFrontendVO>): Promise<PartFrontendVO> {
    await mockDelay();
    const idx = this.partData.findIndex(p => p.key === id);
    if (idx === -1) throw new Error('零件不存在');
    this.partData[idx] = { ...this.partData[idx], ...data };
    return this.partData[idx];
  }

  async deletePart(masterId: string): Promise<boolean> {
    await mockDelay();
    this.partData = this.partData.filter(p => p.key !== masterId);
    return true;
  }

  async batchDeletePart(masterIds: string[]): Promise<boolean> {
    await mockDelay();
    const idSet = new Set(masterIds);
    this.partData = this.partData.filter(p => !idSet.has(p.key));
    return true;
  }
}
