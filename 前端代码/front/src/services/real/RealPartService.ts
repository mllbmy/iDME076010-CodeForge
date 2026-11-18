import type { IPartService, PartFrontendVO, PartQuery } from '../interfaces';
import type { PageRequest, PageResult } from '../interfaces/common';
import * as partApi from '@/api/part';
import { toPartFrontendVO, toPartDTO } from '../adapters';
import type { PartVO } from '@/api/part';

export class RealPartService implements IPartService {
  async getPartList(query: PartQuery, page: PageRequest): Promise<PageResult<PartFrontendVO>> {
    const conditions = this.buildConditions(query);
    const res = await partApi.queryPart({
      queryRequest: {
        filter: { condition: conditions },
        sortInfo: [{ isAsc: false, sortField: 'createTime' }],
      },
      pageVO: { pageNo: page.curPage, pageSize: page.pageSize },
    }) as unknown as { data?: { content?: PartVO[]; list?: PartVO[]; totalCount?: number; total?: number; pageNo?: number } };
    const data = res.data;
    const list = (data?.content || data?.list || []).map(toPartFrontendVO);
    return {
      list,
      total: data?.totalCount ?? data?.total ?? 0,
      curPage: data?.pageNo ?? page.curPage,
      pageSize: page.pageSize,
    };
  }

  async getPartById(id: string): Promise<PartFrontendVO | null> {
    const res = await partApi.getPart({ id }) as unknown as { data?: PartVO };
    return res.data ? toPartFrontendVO(res.data) : null;
  }

  async createPart(data: Partial<PartFrontendVO>): Promise<PartFrontendVO> {
    const res = await partApi.addPart(toPartDTO(data)) as unknown as { data?: PartVO };
    const rawData = res?.data as PartVO;
    return toPartFrontendVO(rawData);
  }

  async updatePart(id: string, data: Partial<PartFrontendVO>): Promise<PartFrontendVO> {
    const res = await partApi.updatePart({ id, ...toPartDTO(data) }) as unknown as { data?: PartVO };
    const rawData = res?.data as PartVO;
    return toPartFrontendVO(rawData);
  }

  async deletePart(masterId: string): Promise<boolean> {
    await partApi.deletePart({ masterId, modifier: 'system' });
    return true;
  }

  async batchDeletePart(masterIds: string[]): Promise<boolean> {
    await partApi.batchDeletePart({ masterIds, modifier: 'system' });
    return true;
  }

  private buildConditions(query: PartQuery) {
    const conditions = [];
    if (query.keyword) {
      conditions.push({ conditionName: 'LIKE', conditionValue: `%${query.keyword}%`, name: 'name' });
    }
    if (query.partCategory) {
      conditions.push({ conditionName: 'EQ', conditionValue: query.partCategory, name: 'part_Category' });
    }
    if (query.status) {
      conditions.push({ conditionName: 'EQ', conditionValue: query.status, name: 'status' });
    }
    return conditions;
  }
}
