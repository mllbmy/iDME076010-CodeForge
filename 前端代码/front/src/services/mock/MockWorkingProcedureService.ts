import type { IWorkingProcedureService, WorkingProcedureFrontendVO, ProcedureQuery } from '../interfaces';
import type { PageRequest, PageResult } from '../interfaces/common';
import { mockDelay } from './mockConfig';

const procedureTemplates = [
  { procedureCode: 'PROC-001', procedureName: '粗车外圆', standardTime: 30, relatedPartId: '1', department: '机加车间一班', equipmentRequired: '', status: '启用', description: '' },
  { procedureCode: 'PROC-002', procedureName: '精车外圆', standardTime: 45, relatedPartId: '1', department: '机加车间一班', equipmentRequired: '', status: '启用', description: '' },
  { procedureCode: 'PROC-003', procedureName: '粗车端面', standardTime: 20, relatedPartId: '1', department: '机加车间一班', equipmentRequired: '', status: '启用', description: '' },
  { procedureCode: 'PROC-004', procedureName: '精车端面', standardTime: 35, relatedPartId: '2', department: '机加车间一班', equipmentRequired: '', status: '启用', description: '' },
  { procedureCode: 'PROC-005', procedureName: '滚齿', standardTime: 60, relatedPartId: '3', department: '齿轮加工部', equipmentRequired: '', status: '启用', description: '' },
  { procedureCode: 'PROC-006', procedureName: '磨齿', standardTime: 90, relatedPartId: '3', department: '齿轮加工部', equipmentRequired: '', status: '启用', description: '' },
  { procedureCode: 'PROC-007', procedureName: '插齿', standardTime: 50, relatedPartId: '4', department: '齿轮加工部', equipmentRequired: '', status: '启用', description: '' },
  { procedureCode: 'PROC-008', procedureName: '热处理-渗碳淬火', standardTime: 480, relatedPartId: '1', department: '热处理部', equipmentRequired: '', status: '启用', description: '' },
  { procedureCode: 'PROC-009', procedureName: '三坐标检测', standardTime: 40, relatedPartId: '1', department: '质量部', equipmentRequired: '', status: '启用', description: '' },
  { procedureCode: 'PROC-010', procedureName: '动平衡', standardTime: 25, relatedPartId: '2', department: '装配部', equipmentRequired: '', status: '启用', description: '' },
  { procedureCode: 'PROC-011', procedureName: '清洗', standardTime: 15, relatedPartId: '2', department: '装配部', equipmentRequired: '', status: '启用', description: '' },
  { procedureCode: 'PROC-012', procedureName: '装配', standardTime: 120, relatedPartId: '11', department: '装配部', equipmentRequired: '', status: '启用', description: '' },
];

function generateMockProcedureData(): WorkingProcedureFrontendVO[] {
  return procedureTemplates.map((t, i) => ({
    key: String(i + 1),
    ...t,
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

export class MockWorkingProcedureService implements IWorkingProcedureService {
  private procedureData: WorkingProcedureFrontendVO[] = generateMockProcedureData();

  async getProcedureList(query: ProcedureQuery, page: PageRequest): Promise<PageResult<WorkingProcedureFrontendVO>> {
    await mockDelay();
    let filtered = [...this.procedureData];
    if (query.keyword) {
      const kw = query.keyword.toLowerCase();
      filtered = filtered.filter(p => p.procedureName.toLowerCase().includes(kw) || p.procedureCode.toLowerCase().includes(kw));
    }
    if (query.department) {
      filtered = filtered.filter(p => p.department === query.department);
    }
    if (query.status) {
      filtered = filtered.filter(p => p.status === query.status);
    }
    return paginate(filtered, page);
  }

  async getProcedureById(id: string): Promise<WorkingProcedureFrontendVO | null> {
    await mockDelay();
    return this.procedureData.find(p => p.key === id) || null;
  }

  async createProcedure(data: Partial<WorkingProcedureFrontendVO>): Promise<WorkingProcedureFrontendVO> {
    await mockDelay();
    const newItem: WorkingProcedureFrontendVO = {
      key: String(this.procedureData.length + 1),
      procedureCode: data.procedureCode || `PROC-${String(this.procedureData.length + 1).padStart(3, '0')}`,
      procedureName: data.procedureName || '',
      standardTime: data.standardTime || 0,
      relatedPartId: data.relatedPartId || '',
      department: data.department || '',
      equipmentRequired: data.equipmentRequired || '',
      status: data.status || '启用',
      description: data.description || '',
    };
    this.procedureData.push(newItem);
    return newItem;
  }

  async updateProcedure(id: string, data: Partial<WorkingProcedureFrontendVO>): Promise<WorkingProcedureFrontendVO> {
    await mockDelay();
    const idx = this.procedureData.findIndex(p => p.key === id);
    if (idx === -1) throw new Error('工序不存在');
    this.procedureData[idx] = { ...this.procedureData[idx], ...data };
    return this.procedureData[idx];
  }

  async deleteProcedure(id: string): Promise<boolean> {
    await mockDelay();
    this.procedureData = this.procedureData.filter(p => p.key !== id);
    return true;
  }

  async batchDeleteProcedure(ids: string[]): Promise<boolean> {
    await mockDelay();
    const idSet = new Set(ids);
    this.procedureData = this.procedureData.filter(p => !idSet.has(p.key));
    return true;
  }
}
