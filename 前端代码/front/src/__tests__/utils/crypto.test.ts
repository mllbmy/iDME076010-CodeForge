import { sha256, generateToken } from '@/utils/crypto';

describe('crypto', () => {
  it('sha256 returns consistent hash', async () => {
    const hash1 = await sha256('password123');
    const hash2 = await sha256('password123');
    expect(hash1).toBe(hash2);
    expect(hash1).toHaveLength(64);
  });

  it('sha256 returns different hash for different input', async () => {
    const hash1 = await sha256('password123');
    const hash2 = await sha256('password456');
    expect(hash1).not.toBe(hash2);
  });

  it('generateToken returns 64-char hex string', () => {
    const token = generateToken();
    expect(token).toHaveLength(64);
    expect(token).toMatch(/^[0-9a-f]+$/);
  });
});
