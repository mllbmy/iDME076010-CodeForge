export interface WorkingProcedureVO {
  id?: string;
  procedure_Name?: string;
  procedure_Code?: string;
  standard_Time?: number;
  related_Part?: { id: string };
  department?: string;
  equipment_Required?: string;
  status?: string;
  description?: string;
  createTime?: string;
  updateTime?: string;
}

export interface WorkingProcedureFrontendVO {
  key: string;
  procedureCode: string;
  procedureName: string;
  standardTime: number;
  relatedPartId: string;
  department: string;
  equipmentRequired: string;
  status: string;
  description: string;
}

const STATUS_DISPLAY: Record<string, string> = {
  D001: '启用',
  D002: '停用',
};

const STATUS_TO_CODE: Record<string, string> = {
  '启用': 'D001',
  '停用': 'D002',
};

export function toProcedureFrontendVO(dto: WorkingProcedureVO): WorkingProcedureFrontendVO {
  return {
    key: dto.id || '',
    procedureCode: dto.procedure_Code || '',
    procedureName: dto.procedure_Name || '',
    standardTime: dto.standard_Time || 0,
    relatedPartId: dto.related_Part?.id || '',
    department: dto.department || '',
    equipmentRequired: dto.equipment_Required || '',
    status: STATUS_DISPLAY[dto.status || ''] || dto.status || '',
    description: dto.description || '',
  };
}

export function toProcedureDTO(vo: Partial<WorkingProcedureFrontendVO>) {
  const result: Record<string, unknown> = {
    procedure_Name: vo.procedureName,
    procedure_Code: vo.procedureCode,
    standard_Time: vo.standardTime,
    department: vo.department,
    equipment_Required: vo.equipmentRequired,
    status: STATUS_TO_CODE[vo.status || ''] || vo.status,
    description: vo.description,
  };
  if (vo.relatedPartId) {
    result.related_Part = { id: vo.relatedPartId };
  }
  return result;
}
