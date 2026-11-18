import type { IWorkingPlanService, WorkingPlanFrontendVO, PlanQuery } from '../interfaces';
import type { PageRequest, PageResult } from '../interfaces/common';
import { mockDelay } from './mockConfig';

const planTemplates = [
  { planCode: 'PLAN-202405-REDUCER', planName: '2024年5月减速器生产计划', planType: '月度计划', startTime: '2024-05-01T08:00:00', endTime: '2024-05-31T18:00:00', priority: '高', status: '草稿', description: '本月重点生产RV系列减速器500台', relatedPartId: '' },
  { planCode: 'PLAN-202406-GS', planName: '2024年6月齿轮轴生产计划', planType: '月度计划', startTime: '2024-06-01T08:00:00', endTime: '2024-06-30T18:00:00', priority: '中', status: '草稿', description: '齿轮轴月度生产计划', relatedPartId: '' },
  { planCode: 'PLAN-Q2-HEAT', planName: '2024年Q2热处理计划', planType: '季度计划', startTime: '2024-04-01T08:00:00', endTime: '2024-06-30T18:00:00', priority: '高', status: '已审核', description: 'Q2季度热处理计划', relatedPartId: '' },
  { planCode: 'PLAN-202405-QC', planName: '2024年5月质量检测计划', planType: '月度计划', startTime: '2024-05-01T08:00:00', endTime: '2024-05-31T18:00:00', priority: '中', status: '草稿', description: '5月质量检测计划', relatedPartId: '' },
  { planCode: 'PLAN-202406-ASSY', planName: '2024年6月装配计划', planType: '月度计划', startTime: '2024-06-01T08:00:00', endTime: '2024-06-30T18:00:00', priority: '低', status: '草稿', description: '6月装配计划', relatedPartId: '' },
];

function generateMockPlanData(): WorkingPlanFrontendVO[] {
  return planTemplates.map((t, i) => ({
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

export class MockWorkingPlanService implements IWorkingPlanService {
  private planData: WorkingPlanFrontendVO[] = generateMockPlanData();

  async getPlanList(query: PlanQuery, page: PageRequest): Promise<PageResult<WorkingPlanFrontendVO>> {
    await mockDelay();
    let filtered = [...this.planData];
    if (query.keyword) {
      const kw = query.keyword.toLowerCase();
      filtered = filtered.filter(p => p.planName.toLowerCase().includes(kw) || p.planCode.toLowerCase().includes(kw));
    }
    if (query.planType) {
      filtered = filtered.filter(p => p.planType === query.planType);
    }
    if (query.status) {
      filtered = filtered.filter(p => p.status === query.status);
    }
    return paginate(filtered, page);
  }

  async getPlanById(id: string): Promise<WorkingPlanFrontendVO | null> {
    await mockDelay();
    return this.planData.find(p => p.key === id) || null;
  }

  async createPlan(data: Partial<WorkingPlanFrontendVO>): Promise<WorkingPlanFrontendVO> {
    await mockDelay();
    const newItem: WorkingPlanFrontendVO = {
      key: String(this.planData.length + 1),
      planCode: data.planCode || `PLAN-${String(this.planData.length + 1).padStart(3, '0')}`,
      planName: data.planName || '',
      planType: data.planType || '',
      startTime: data.startTime || '',
      endTime: data.endTime || '',
      priority: data.priority || '',
      status: data.status || '草稿',
      description: data.description || '',
      relatedPartId: data.relatedPartId || '',
    };
    this.planData.push(newItem);
    return newItem;
  }

  async updatePlan(id: string, data: Partial<WorkingPlanFrontendVO>): Promise<WorkingPlanFrontendVO> {
    await mockDelay();
    const idx = this.planData.findIndex(p => p.key === id);
    if (idx === -1) throw new Error('工作计划不存在');
    this.planData[idx] = { ...this.planData[idx], ...data };
    return this.planData[idx];
  }

  async deletePlan(id: string): Promise<boolean> {
    await mockDelay();
    this.planData = this.planData.filter(p => p.key !== id);
    return true;
  }

  async batchDeletePlan(ids: string[]): Promise<boolean> {
    await mockDelay();
    const idSet = new Set(ids);
    this.planData = this.planData.filter(p => !idSet.has(p.key));
    return true;
  }
}
