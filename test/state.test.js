import { state, createSelector, patch, set } from '../index';

describe('state', () => {
  it('should create', () => {
    const s = state(true);
    expect(s.getState()).toBe(true);
  });

  it('should set state', () => {
    const myState = { fetching: false, error: true };
    const s = state(myState);
    expect(s.getState()).toBe(myState);
    s.setState(s => ({ ...s, fetching: true }));
    expect(s.getState()).toStrictEqual({ fetching: true, error: true });
  });

  it('should set state (with patch)', () => {
    const myState = { fetching: false, error: true };
    const s = state(myState);
    expect(s.getState()).toBe(myState);
    s.setState(patch({ fetching: true }));
    expect(s.getState()).toStrictEqual({ fetching: true, error: true });
  });

  it('should set state (with set)', () => {
    const myState = { fetching: false, error: true };
    const s = state(myState);
    expect(s.getState()).toBe(myState);
    s.setState(set({ fetching: true, error: true }));
    expect(s.getState()).toStrictEqual({ fetching: true, error: true });
  });

  it('should subscribe', () => {
    const myState = { fetching: false, error: true };
    const s = state(myState);
    const spy = jest.fn();
    s.subscribe(spy);
    expect(spy).toHaveBeenCalledWith(myState);
    s.setState(() => false);
    expect(spy).toHaveBeenCalledWith(false);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('should unsubscribe', () => {
    const myState = { fetching: false, error: true };
    const s = state(myState);
    const spy = jest.fn();
    const u = s.subscribe(spy);
    expect(spy).toHaveBeenCalledWith(myState);
    u();
    s.setState(() => false);
    expect(spy).not.toHaveBeenCalledWith(false);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should subscribe with a selector', () => {
    const myState = {
      fetching: false,
      error: true,
      data: [
        { id: 1, a: 'a' },
        { id: 2, a: 'b' },
        { id: 3, a: 'c' },
      ],
    };

    const s = state(myState);
    const spy = jest.fn();

    const fetching = ({ fetching }) => fetching;
    const data = ({ data }) => data.find(({ id }) => id === 2)?.a;

    const selector = createSelector(fetching, data, spy);

    s.subscribe(selector);
    expect(spy).toHaveBeenCalledWith(false, 'b');

    spy.mockClear();

    s.setState(state => ({
      ...state,
      data: [...state.data, { id: 4, a: 'd' }],
    }));

    expect(spy).not.toHaveBeenCalled();
    s.setState(patch({ fetching: true }));
    expect(spy).toHaveBeenCalledWith(true, 'b');
  });
});
