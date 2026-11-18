import type { CertifyRecord, TraceNode } from '../interfaces/IBlockchainService';

function randomHex(length: number): string {
  const chars = '0123456789abcdef';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generateTxHash(): string {
  return `0x${randomHex(64)}`;
}

export function generateBlockHash(): string {
  return `0x${randomHex(64)}`;
}

export function generateAddress(): string {
  return `0x${randomHex(40)}`;
}

let blockCounter = 20000000 + Math.floor(Math.random() * 100000);

export function nextBlockNumber(): number {
  return ++blockCounter;
}

export function generateCertifyRecord(
  dataType: 'process_route' | 'stock_record',
  dataId: string,
  dataHash: string,
): CertifyRecord {
  return {
    txHash: generateTxHash(),
    dataType,
    dataId,
    dataHash,
    blockNumber: nextBlockNumber(),
    blockHash: generateBlockHash(),
    timestamp: new Date().toISOString(),
    status: 'confirmed',
    network: 'Hyperledger Fabric',
    fromAddress: generateAddress(),
  };
}

export function generateDataHash(payload: Record<string, unknown>): string {
  const json = JSON.stringify(payload);
  let hash = 0;
  for (let i = 0; i < json.length; i++) {
    const char = json.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return `0x${Math.abs(hash).toString(16).padStart(16, '0')}${randomHex(48)}`;
}

export function generateTraceNodes(
  dataType: 'process_route' | 'stock_record',
  dataId: string,
  count: number,
): TraceNode[] {
  const actions = dataType === 'process_route'
    ? ['创建工艺路线', '修改工序步骤', '版本升级', 'AI推荐采纳', '启用路线']
    : ['入库登记', '出库登记', '库存盘点', '库存调拨', '退货入库'];

  const operators = ['张工', '李工', '王工', '赵工', '系统自动'];
  const nodes: TraceNode[] = [];

  for (let i = 0; i < count; i++) {
    const date = new Date();
    date.setHours(date.getHours() - (count - i) * 4);

    nodes.push({
      txHash: generateTxHash(),
      dataType,
      dataId,
      action: actions[i % actions.length],
      operator: operators[i % operators.length],
      timestamp: date.toISOString(),
      blockNumber: nextBlockNumber(),
      previousTxHash: i > 0 ? nodes[i - 1].txHash : null,
    });
  }

  return nodes;
}
