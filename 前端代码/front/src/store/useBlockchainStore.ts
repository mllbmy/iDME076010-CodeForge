import { create } from 'zustand';
import type { CertifyRecord, VerifyResult, TraceNode, CertifyParams, VerifyParams, TraceParams, BlockchainDataType } from '@/services/interfaces/IBlockchainService';
import { getBlockchainService } from '@/services/registry';
import { generateDataHash } from '@/services/mock/blockchainMockData';

interface BlockchainStore {
  certifyRecords: Record<string, CertifyRecord>;
  verifyResults: Record<string, VerifyResult>;
  traceNodes: Record<string, TraceNode[]>;
  loading: Record<string, boolean>;
  certify: (params: CertifyParams) => Promise<CertifyRecord>;
  verify: (params: VerifyParams) => Promise<VerifyResult>;
  getTrace: (params: TraceParams) => Promise<TraceNode[]>;
  getHistory: (dataType: BlockchainDataType, dataId: string) => Promise<CertifyRecord[]>;
  isCertified: (dataId: string) => boolean;
  getCertifyRecord: (dataId: string) => CertifyRecord | undefined;
  getVerifyResult: (dataId: string) => VerifyResult | undefined;
  getTraceNodes: (dataId: string) => TraceNode[];
}

export const useBlockchainStore = create<BlockchainStore>((set, get) => ({
  certifyRecords: {},
  verifyResults: {},
  traceNodes: {},
  loading: {},

  certify: async (params) => {
    const key = params.dataId;
    set((s) => ({ loading: { ...s.loading, [`certify-${key}`]: true } }));
    try {
      const service = getBlockchainService();
      const result = await service.certify(params);
      if (result.success) {
        set((s) => ({
          certifyRecords: { ...s.certifyRecords, [key]: result.data },
        }));
      }
      return result.data;
    } finally {
      set((s) => ({ loading: { ...s.loading, [`certify-${key}`]: false } }));
    }
  },

  verify: async (params) => {
    const key = params.dataId;
    set((s) => ({ loading: { ...s.loading, [`verify-${key}`]: true } }));
    try {
      const service = getBlockchainService();
      const result = await service.verify(params);
      if (result.success) {
        set((s) => ({
          verifyResults: { ...s.verifyResults, [key]: result.data },
        }));
      }
      return result.data;
    } finally {
      set((s) => ({ loading: { ...s.loading, [`verify-${key}`]: false } }));
    }
  },

  getTrace: async (params) => {
    const key = params.dataId;
    set((s) => ({ loading: { ...s.loading, [`trace-${key}`]: true } }));
    try {
      const service = getBlockchainService();
      const result = await service.getTrace(params);
      if (result.success) {
        set((s) => ({
          traceNodes: { ...s.traceNodes, [key]: result.data },
        }));
      }
      return result.data;
    } finally {
      set((s) => ({ loading: { ...s.loading, [`trace-${key}`]: false } }));
    }
  },

  getHistory: async (dataType, dataId) => {
    const key = dataId;
    set((s) => ({ loading: { ...s.loading, [`history-${key}`]: true } }));
    try {
      const service = getBlockchainService();
      const result = await service.getHistory(dataType, dataId);
      return result.data;
    } finally {
      set((s) => ({ loading: { ...s.loading, [`history-${key}`]: false } }));
    }
  },

  isCertified: (dataId) => {
    return !!get().certifyRecords[dataId];
  },

  getCertifyRecord: (dataId) => {
    return get().certifyRecords[dataId];
  },

  getVerifyResult: (dataId) => {
    return get().verifyResults[dataId];
  },

  getTraceNodes: (dataId) => {
    return get().traceNodes[dataId] || [];
  },
}));

export { generateDataHash };
