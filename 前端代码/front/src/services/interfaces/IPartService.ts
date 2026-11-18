import type { PageRequest, PageResult } from './common';

export interface PartFrontendVO {
  key: string;
  partCode: string;
  partName: string;
  partCategory: string;
  material: string;
  specification: string;
  weight: number;
  unit: string;
  drawingNo: string;
  status: string;
}

export interface PartQuery {
  keyword?: string;
  partCategory?: string;
  status?: string;
  showPriority?: boolean;
}

export interface IPartService {
  getPartList(query: PartQuery, page: PageRequest): Promise<PageResult<PartFrontendVO>>;
  getPartById(id: string): Promise<PartFrontendVO | null>;
  createPart(data: Partial<PartFrontendVO>): Promise<PartFrontendVO>;
  updatePart(id: string, data: Partial<PartFrontendVO>): Promise<PartFrontendVO>;
  deletePart(masterId: string): Promise<boolean>;
  batchDeletePart(masterIds: string[]): Promise<boolean>;
}
