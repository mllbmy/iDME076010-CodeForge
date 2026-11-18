export interface PartVO {
  id?: string;
  name?: string;
  part_Code?: string;
  part_Category?: string;
  material?: string;
  specification?: string;
  weight?: number;
  unit?: string;
  drawing_No?: string;
  status?: string;
  createTime?: string;
  updateTime?: string;
}

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

const PART_CATEGORY_DISPLAY: Record<string, string> = {
  C001: '伺服电机',
  C002: '齿轮',
  C003: '轴承',
  C005: '太阳轮',
  C007: '内齿圈',
  C008: '输出轴',
  C009: '输入轴',
  C010: '密封件',
  C011: '联轴器',
  C012: '减速器壳体',
};

const PART_CATEGORY_TO_CODE: Record<string, string> = Object.fromEntries(
  Object.entries(PART_CATEGORY_DISPLAY).map(([k, v]) => [v, k]),
);

const STATUS_DISPLAY: Record<string, string> = {
  D001: '启用',
  D002: '停用',
};

const STATUS_TO_CODE: Record<string, string> = {
  '启用': 'D001',
  '停用': 'D002',
};

export function toPartFrontendVO(dto: PartVO): PartFrontendVO {
  return {
    key: dto.id || '',
    partCode: dto.part_Code || '',
    partName: dto.name || '',
    partCategory: PART_CATEGORY_DISPLAY[dto.part_Category || ''] || dto.part_Category || '',
    material: dto.material || '',
    specification: dto.specification || '',
    weight: dto.weight || 0,
    unit: dto.unit || '',
    drawingNo: dto.drawing_No || '',
    status: STATUS_DISPLAY[dto.status || ''] || dto.status || '',
  };
}

export function toPartDTO(vo: Partial<PartFrontendVO>) {
  return {
    name: vo.partName,
    part_Code: vo.partCode,
    part_Category: PART_CATEGORY_TO_CODE[vo.partCategory || ''] || vo.partCategory,
    material: vo.material,
    specification: vo.specification,
    weight: vo.weight,
    unit: vo.unit,
    drawing_No: vo.drawingNo,
    status: STATUS_TO_CODE[vo.status || ''] || vo.status,
    master: {},
    branch: {},
  };
}
