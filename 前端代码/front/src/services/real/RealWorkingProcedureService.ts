import type { IWorkingProcedureService, WorkingProcedureFrontendVO, ProcedureQuery } from '../interfaces';
import type { PageRequest, PageResult } from '../interfaces/common';
import * as procedureApi from '@/api/workingProcedure';
import { toProcedureFrontendVO, toProcedureDTO } from '../adapters';
import type { WorkingProcedureVO } from '@/api/workingProcedure';

export class RealWorkingProcedureService implements IWorkingProcedureService {
  async getProcedureList(query: ProcedureQuery, page: PageRequest): Promise<PageResult<WorkingProcedureFrontendVO>> {
    const conditions = this.buildConditions(query);
    const res = await procedureApi.queryWorkingProcedure({
      queryRequest: {
        filter: { condition: conditions },
        sortInfo: [{ isAsc: false, sortField: 'createTime' }],
      },
      pageVO: { pageNo: page.curPage, pageSize: page.pageSize },
    }) as unknown as { data?: { content?: WorkingProcedureVO[]; list?: WorkingProcedureVO[]; totalCount?: number; total?: number; pageNo?: number } };
    const data = res.data;
    const list = (data?.content || data?.list || []).map(toProcedureFrontendVO);
    return {
      list,
      total: data?.totalCount ?? data?.total ?? 0,
      curPage: data?.pageNo ?? page.curPage,
      pageSize: page.pageSize,
    };
  }

  async getProcedureById(id: string): Promise<WorkingProcedureFrontendVO | null> {
    const res = await procedureApi.getWorkingProcedure({ id }) as unknown as { data?: WorkingProcedureVO };
    return res.data ? toProcedureFrontendVO(res.data) : null;
  }

  async createProcedure(data: Partial<WorkingProcedureFrontendVO>): Promise<WorkingProcedureFrontendVO> {
    const res = await procedureApi.addWorkingProcedure(toProcedureDTO(data)) as unknown as { data?: WorkingProcedureVO };
    const rawData = res?.data as WorkingProcedureVO;
    return toProcedureFrontendVO(rawData);
  }

  async updateProcedure(id: string, data: Partial<WorkingProcedureFrontendVO>): Promise<WorkingProcedureFrontendVO> {
    const res = await procedureApi.updateWorkingProcedure({ id, ...toProcedureDTO(data) }) as unknown as { data?: WorkingProcedureVO };
    const rawData = res?.data as WorkingProcedureVO;
    return toProcedureFrontendVO(rawData);
  }

  async deleteProcedure(id: string): Promise<boolean> {
    await procedureApi.deleteWorkingProcedure({ id, modifier: 'system' });
    return true;
  }

  async batchDeleteProcedure(ids: string[]): Promise<boolean> {
    await procedureApi.batchDeleteWorkingProcedure({ ids, modifier: 'system' });
    return true;
  }

  private buildConditions(query: ProcedureQuery) {
    const conditions = [];
    if (query.keyword) {
      conditions.push({ conditionName: 'LIKE', conditionValue: `%${query.keyword}%`, name: 'procedure_Name' });
    }
    if (query.department) {
      conditions.push({ conditionName: 'EQ', conditionValue: query.department, name: 'department' });
    }
    if (query.status) {
      conditions.push({ conditionName: 'EQ', conditionValue: query.status, name: 'status' });
    }
    return conditions;
  }
}
