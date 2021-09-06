import { memo } from '../index';

describe('memo', () => {
  it('should memoize', () => {
    const fn = jest.fn();
    const mfn = memo(fn);
    const args = [1, 2, 3, 4, 5];
    mfn(...args);
    expect(fn).toHaveBeenCalledWith(...args);
    fn.mockClear();
    mfn(...args);
    expect(fn).not.toHaveBeenCalledWith(...args);
    mfn(1, ...args);
    expect(fn).toHaveBeenCalledWith(1, ...args);
  });
});
