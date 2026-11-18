export interface WorkingPlanVO {
  id?: string;
  plan_Name?: string;
  plan_Code?: string;
  plan_Type?: string;
  start_Time?: string;
  end_Time?: string;
  priority?: string;
  status?: string;
  description?: string;
  related_Part?: { id: string };
  createTime?: string;
  updateTime?: string;
}

export interface WorkingPlanFrontendVO {
  key: string;
  planCode: string;
  planName: string;
  planType: string;
  startTime: string;
  endTime: string;
  priority: string;
  status: string;
  description: string;
  relatedPartId: string;
}

const STATUS_DISPLAY: Record<string, string> = {
  DRAFT: '草稿',
  REVIEWED: '已审核',
  IN_PROGRESS: '进行中',
  COMPLETED: '已完成',
  CANCELLED: '已取消',
};

const STATUS_TO_CODE: Record<string, string> = {
  '草稿': 'DRAFT',
  '已审核': 'REVIEWED',
  '进行中': 'IN_PROGRESS',
  '已完成': 'COMPLETED',
  '已取消': 'CANCELLED',
};

export function toPlanFrontendVO(dto: WorkingPlanVO): WorkingPlanFrontendVO {
  return {
    key: dto.id || '',
    planCode: dto.plan_Code || '',
    planName: dto.plan_Name || '',
    planType: dto.plan_Type || '',
    startTime: dto.start_Time || '',
    endTime: dto.end_Time || '',
    priority: dto.priority || '',
    status: STATUS_DISPLAY[dto.status || ''] || dto.status || '',
    description: dto.description || '',
    relatedPartId: dto.related_Part?.id || '',
  };
}

export function toPlanDTO(vo: Partial<WorkingPlanFrontendVO>) {
  const result: Record<string, unknown> = {
    plan_Name: vo.planName,
    plan_Code: vo.planCode,
    plan_Type: vo.planType,
    start_Time: vo.startTime,
    end_Time: vo.endTime,
    priority: vo.priority,
    status: STATUS_TO_CODE[vo.status || ''] || vo.status,
    description: vo.description,
  };
  if (vo.relatedPartId) {
    result.related_Part = { id: vo.relatedPartId };
  }
  return result;
}
