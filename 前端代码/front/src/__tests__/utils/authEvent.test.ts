import { onUnauthorized, emitUnauthorized } from '@/utils/authEvent';

describe('authEvent', () => {
  it('calls listener when emitUnauthorized is called', () => {
    const callback = vi.fn();
    const unsubscribe = onUnauthorized(callback);
    emitUnauthorized();
    expect(callback).toHaveBeenCalledTimes(1);
    unsubscribe();
  });

  it('unsubscribe removes the listener', () => {
    const callback = vi.fn();
    const unsubscribe = onUnauthorized(callback);
    unsubscribe();
    emitUnauthorized();
    expect(callback).not.toHaveBeenCalled();
  });

  it('multiple listeners are all called', () => {
    const cb1 = vi.fn();
    const cb2 = vi.fn();
    const unsub1 = onUnauthorized(cb1);
    const unsub2 = onUnauthorized(cb2);
    emitUnauthorized();
    expect(cb1).toHaveBeenCalledTimes(1);
    expect(cb2).toHaveBeenCalledTimes(1);
    unsub1();
    unsub2();
  });
});
