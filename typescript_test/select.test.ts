import { createSelector } from '../index';

describe('select', () => {
  it('should work (with a single func)', () => {
    const state = {
      fetching: true,
      error: false,
    };

    const spy = jest.fn(a => a);
    const selector = createSelector(spy);

    // first call
    const result = selector(state);

    expect(result).toBe(state);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(state);

    spy.mockClear();

    // second call is memoized - spy should not have been called
    expect(selector(state)).toBe(state);
    expect(spy).not.toHaveBeenCalled();

    // next call is unmemo-ed
    const nextState = { ...state, extra: 'fred' };
    expect(selector(nextState)).toBe(nextState);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(nextState);
  });

  it('should work with multiple funcs (all args)', () => {
    interface State {
      fetching: boolean;
      error?: boolean;
      name?: string;
    }
    const state = {
      fetching: true,
      error: false,
    };

    const spy = jest.fn((first: boolean, second: boolean) => [first, second]);

    const selector = createSelector(
      (state: State) => state.fetching,
      (state: State) => state.error,
      spy
    );

    expect(selector(state)).toStrictEqual([true, false]);
    expect(spy).toHaveBeenCalledWith(true, false);
    expect(spy).toHaveBeenCalledTimes(1);

    spy.mockClear();

    // // call with same reference doesn't result in selector being called - same behavior as reselect
    state.fetching = false;
    expect(selector(state)).toStrictEqual([true, false]);

    // this is sneaky - the computation function would NOT be called because it's
    // arguments are the same  even though the reference has changed
    expect(
      selector({ fetching: true, error: false, name: 'fred' })
    ).toStrictEqual([true, false]);
    expect(spy).not.toHaveBeenCalled();

    expect(selector({ fetching: false })).toStrictEqual([false, undefined]);
    expect(spy).toHaveBeenCalled();
  });

  it('should work with multiple funcs (array args)', () => {

    interface State {
      fetching: boolean;
      error?: boolean;
      name?: string;
    }

    const state = {
      fetching: true,
      error: false,
    };

    const spy = jest.fn((first: boolean, second: boolean) => [first, second]);

    const selector = createSelector(
      [
        (state: State) => state.fetching,
        (state: State) => state.error
      ],
      spy
    );

    expect(selector(state)).toStrictEqual([true, false]);
    expect(spy).toHaveBeenCalledWith(true, false);
    expect(spy).toHaveBeenCalledTimes(1);

    spy.mockClear();

    // // call with same reference doesn't result in selector being called - same behavior as reselect
    state.fetching = false;
    expect(selector(state)).toStrictEqual([true, false]);

    // this is sneaky - the computation function would NOT be called because it's
    // arguments are the same  even though the reference has changed
    expect(
      selector({ fetching: true, error: false, name: 'fred' })
    ).toStrictEqual([true, false]);
    expect(spy).not.toHaveBeenCalled();

    expect(selector({ fetching: false })).toStrictEqual([false, undefined]);
    expect(spy).toHaveBeenCalled();
  });
});
