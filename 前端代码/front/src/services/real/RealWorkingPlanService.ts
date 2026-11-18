import type { IWorkingPlanService, WorkingPlanFrontendVO, PlanQuery } from '../interfaces';
import type { PageRequest, PageResult } from '../interfaces/common';
import * as planApi from '@/api/workingPlan';
import { toPlanFrontendVO, toPlanDTO } from '../adapters';
import type { WorkingPlanVO } from '@/api/workingPlan';

export class RealWorkingPlanService implements IWorkingPlanService {
  async getPlanList(query: PlanQuery, page: PageRequest): Promise<PageResult<WorkingPlanFrontendVO>> {
    const conditions = this.buildConditions(query);
    const res = await planApi.queryWorkingPlan({
      queryRequest: {
        filter: { condition: conditions },
        sortInfo: [{ isAsc: false, sortField: 'createTime' }],
      },
      pageVO: { pageNo: page.curPage, pageSize: page.pageSize },
    }) as unknown as { data?: { content?: WorkingPlanVO[]; list?: WorkingPlanVO[]; totalCount?: number; total?: number; pageNo?: number } };
    const data = res.data;
    const list = (data?.content || data?.list || []).map(toPlanFrontendVO);
    return {
      list,
      total: data?.totalCount ?? data?.total ?? 0,
      curPage: data?.pageNo ?? page.curPage,
      pageSize: page.pageSize,
    };
  }

  async getPlanById(id: string): Promise<WorkingPlanFrontendVO | null> {
    const res = await planApi.getWorkingPlan({ id }) as unknown as { data?: WorkingPlanVO };
    return res.data ? toPlanFrontendVO(res.data) : null;
  }

  async createPlan(data: Partial<WorkingPlanFrontendVO>): Promise<WorkingPlanFrontendVO> {
    const res = await planApi.addWorkingPlan(toPlanDTO(data)) as unknown as { data?: WorkingPlanVO };
    const rawData = res?.data as WorkingPlanVO;
    return toPlanFrontendVO(rawData);
  }

  async updatePlan(id: string, data: Partial<WorkingPlanFrontendVO>): Promise<WorkingPlanFrontendVO> {
    const res = await planApi.updateWorkingPlan({ id, ...toPlanDTO(data) }) as unknown as { data?: WorkingPlanVO };
    const rawData = res?.data as WorkingPlanVO;
    return toPlanFrontendVO(rawData);
  }

  async deletePlan(id: string): Promise<boolean> {
    await planApi.deleteWorkingPlan({ id, modifier: 'system' });
    return true;
  }

  async batchDeletePlan(ids: string[]): Promise<boolean> {
    await planApi.batchDeleteWorkingPlan({ ids, modifier: 'system' });
    return true;
  }

  private buildConditions(query: PlanQuery) {
    const conditions = [];
    if (query.keyword) {
      conditions.push({ conditionName: 'LIKE', conditionValue: `%${query.keyword}%`, name: 'plan_Name' });
    }
    if (query.planType) {
      conditions.push({ conditionName: 'EQ', conditionValue: query.planType, name: 'plan_Type' });
    }
    if (query.status) {
      conditions.push({ conditionName: 'EQ', conditionValue: query.status, name: 'status' });
    }
    return conditions;
  }
}
