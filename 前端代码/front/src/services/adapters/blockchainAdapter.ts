import type { CertifyRecord, VerifyResult, TraceNode } from '../interfaces/IBlockchainService';

export function toCertifyRecord(data: Record<string, unknown>): CertifyRecord {
  return {
    txHash: (data.txHash as string) || '',
    dataType: (data.dataType as CertifyRecord['dataType']) || 'process_route',
    dataId: (data.dataId as string) || '',
    dataHash: (data.dataHash as string) || '',
    blockNumber: (data.blockNumber as number) || 0,
    blockHash: (data.blockHash as string) || '',
    timestamp: (data.timestamp as string) || '',
    status: (data.status as CertifyRecord['status']) || 'pending',
    network: (data.network as string) || '',
    fromAddress: (data.fromAddress as string) || '',
  };
}

export function toVerifyResult(data: Record<string, unknown>): VerifyResult {
  return {
    dataId: (data.dataId as string) || '',
    dataHash: (data.dataHash as string) || '',
    onChainHash: (data.onChainHash as string) || '',
    verifyStatus: (data.verifyStatus as VerifyResult['verifyStatus']) || 'not_found',
    blockNumber: (data.blockNumber as number) || 0,
    timestamp: (data.timestamp as string) || '',
    match: (data.match as boolean) || false,
  };
}

export function toTraceNode(data: Record<string, unknown>): TraceNode {
  return {
    txHash: (data.txHash as string) || '',
    dataType: (data.dataType as TraceNode['dataType']) || 'process_route',
    dataId: (data.dataId as string) || '',
    action: (data.action as string) || '',
    operator: (data.operator as string) || '',
    timestamp: (data.timestamp as string) || '',
    blockNumber: (data.blockNumber as number) || 0,
    previousTxHash: (data.previousTxHash as string | null) ?? null,
  };
}
