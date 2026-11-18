export interface Process {
  key: string;
  processId: string;
  processName: string;
  processDescription: string;
  workshop: string;
  standardHours: number;
  equipment: string;
  operator: string;
  status: string;
  order: number;
  createDate: string;
  updateTime: string;
}

export interface ProcessRoute {
  key: string;
  routeId: string;
  routeName: string;
  version: string;
  product: string;
  routeDescription: string;
  status: string;
  createDate: string;
  updateTime: string;
  processList: ProcessStep[];
  history: RouteHistory[];
}

export interface ProcessStep {
  key: string;
  step: number;
  processId: string;
  processName: string;
  workshop: string;
  standardHours: number;
  equipment: string;
}

export interface RouteHistory {
  key: string;
  version: string;
  changeContent: string;
  changeDate: string;
  changePerson: string;
}

export interface RouteBlockchainInfo {
  certified: boolean;
  txHash?: string;
  dataHash?: string;
  certifyTime?: string;
  blockNumber?: number;
}
