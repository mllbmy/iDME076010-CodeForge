export type BlockchainDataType = 'process_route' | 'stock_record';

export type CertifyStatus = 'pending' | 'confirmed' | 'failed';

export type VerifyStatus = 'verified' | 'tampered' | 'not_found' | 'verifying';

export interface CertifyRecord {
  txHash: string;
  dataType: BlockchainDataType;
  dataId: string;
  dataHash: string;
  blockNumber: number;
  blockHash: string;
  timestamp: string;
  status: CertifyStatus;
  network: string;
  fromAddress: string;
}

export interface VerifyResult {
  dataId: string;
  dataHash: string;
  onChainHash: string;
  verifyStatus: VerifyStatus;
  blockNumber: number;
  timestamp: string;
  match: boolean;
}

export interface TraceNode {
  txHash: string;
  dataType: BlockchainDataType;
  dataId: string;
  action: string;
  operator: string;
  timestamp: string;
  blockNumber: number;
  previousTxHash: string | null;
}

export interface CertifyParams {
  dataType: BlockchainDataType;
  dataId: string;
  payload: Record<string, unknown>;
}

export interface VerifyParams {
  dataType: BlockchainDataType;
  dataId: string;
  dataHash: string;
}

export interface TraceParams {
  dataType: BlockchainDataType;
  dataId: string;
}

export interface BlockchainServiceResult<T> {
  success: boolean;
  data: T;
  latency: number;
  message?: string;
}

export interface IBlockchainService {
  certify(params: CertifyParams): Promise<BlockchainServiceResult<CertifyRecord>>;
  verify(params: VerifyParams): Promise<BlockchainServiceResult<VerifyResult>>;
  getTrace(params: TraceParams): Promise<BlockchainServiceResult<TraceNode[]>>;
  getHistory(dataType: BlockchainDataType, dataId: string): Promise<BlockchainServiceResult<CertifyRecord[]>>;
}
