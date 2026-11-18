import type { IBlockchainService, CertifyParams, VerifyParams, TraceParams, CertifyRecord, VerifyResult, TraceNode, BlockchainServiceResult } from '../interfaces/IBlockchainService';
import { generateCertifyRecord, generateDataHash, generateTraceNodes } from './blockchainMockData';

function mockDelay(): Promise<void> {
  const ms = 300 + Math.random() * 500;
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class MockBlockchainService implements IBlockchainService {
  async certify(params: CertifyParams): Promise<BlockchainServiceResult<CertifyRecord>> {
    await mockDelay();
    const dataHash = generateDataHash(params.payload);
    const record = generateCertifyRecord(params.dataType, params.dataId, dataHash);
    return { success: true, data: record, latency: 450, message: '存证成功' };
  }

  async verify(params: VerifyParams): Promise<BlockchainServiceResult<VerifyResult>> {
    await mockDelay();
    const result: VerifyResult = {
      dataId: params.dataId,
      dataHash: params.dataHash,
      onChainHash: params.dataHash,
      verifyStatus: 'verified',
      blockNumber: 20000123 + Math.floor(Math.random() * 1000),
      timestamp: new Date().toISOString(),
      match: true,
    };
    return { success: true, data: result, latency: 320, message: '验证通过，数据未被篡改' };
  }

  async getTrace(params: TraceParams): Promise<BlockchainServiceResult<TraceNode[]>> {
    await mockDelay();
    const nodes = generateTraceNodes(params.dataType, params.dataId, 5);
    return { success: true, data: nodes, latency: 380 };
  }

  async getHistory(dataType: 'process_route' | 'stock_record', dataId: string): Promise<BlockchainServiceResult<CertifyRecord[]>> {
    await mockDelay();
    const records: CertifyRecord[] = [];
    for (let i = 0; i < 3; i++) {
      const date = new Date();
      date.setHours(date.getHours() - i * 8);
      records.push({
        ...generateCertifyRecord(dataType, dataId, generateDataHash({ version: i })),
        timestamp: date.toISOString(),
      });
    }
    return { success: true, data: records, latency: 350 };
  }
}
