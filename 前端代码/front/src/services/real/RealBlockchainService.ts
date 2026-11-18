import type { IBlockchainService, CertifyParams, VerifyParams, TraceParams, CertifyRecord, VerifyResult, TraceNode, BlockchainServiceResult } from '../interfaces/IBlockchainService';

export class RealBlockchainService implements IBlockchainService {
  async certify(_params: CertifyParams): Promise<BlockchainServiceResult<CertifyRecord>> {
    throw new Error('RealBlockchainService.certify not implemented - backend not deployed');
  }

  async verify(_params: VerifyParams): Promise<BlockchainServiceResult<VerifyResult>> {
    throw new Error('RealBlockchainService.verify not implemented - backend not deployed');
  }

  async getTrace(_params: TraceParams): Promise<BlockchainServiceResult<TraceNode[]>> {
    throw new Error('RealBlockchainService.getTrace not implemented - backend not deployed');
  }

  async getHistory(_dataType: 'process_route' | 'stock_record', _dataId: string): Promise<BlockchainServiceResult<CertifyRecord[]>> {
    throw new Error('RealBlockchainService.getHistory not implemented - backend not deployed');
  }
}
