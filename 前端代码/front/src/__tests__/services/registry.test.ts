import { getEquipmentService, getAuthService, getEquipmentAiService, getCodeAiService, getRouteAiService, getBomAiService } from '@/services/registry';
import { MockEquipmentService } from '@/services/mock/MockEquipmentService';
import { MockAuthService } from '@/services/mock/MockAuthService';

describe('ServiceRegistry', () => {
  describe('mock mode', () => {
    it('returns MockEquipmentService instance', () => {
      const service = getEquipmentService();
      expect(service).toBeInstanceOf(MockEquipmentService);
    });

    it('returns MockAuthService instance', () => {
      const service = getAuthService();
      expect(service).toBeInstanceOf(MockAuthService);
    });
  });

  describe('caching', () => {
    it('returns same equipment service instance for repeated calls', () => {
      const s1 = getEquipmentService();
      const s2 = getEquipmentService();
      expect(s1).toBe(s2);
    });

    it('returns same auth service instance for repeated calls', () => {
      const s1 = getAuthService();
      const s2 = getAuthService();
      expect(s1).toBe(s2);
    });

    it('returns same AI service instances for repeated calls', () => {
      const ai1 = getEquipmentAiService();
      const ai2 = getEquipmentAiService();
      expect(ai1).toBe(ai2);

      const code1 = getCodeAiService();
      const code2 = getCodeAiService();
      expect(code1).toBe(code2);

      const route1 = getRouteAiService();
      const route2 = getRouteAiService();
      expect(route1).toBe(route2);

      const bom1 = getBomAiService();
      const bom2 = getBomAiService();
      expect(bom1).toBe(bom2);
    });
  });
});
