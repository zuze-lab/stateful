import { state, createSelector } from '../index';

describe('state', () => {
  it('should create', () => {
    const s = state(true);
    expect(s.getState()).toBe(true);
  });

  it('should set state (with a function)', () => {
    const s = state(true);
    expect(s.getState()).toBe(true);
    s.setState(() => false);
    expect(s.getState()).toBe(false);
  });

  it('should set state (with a patch)', () => {
    const myState = { fetching: false, error: true };
    const s = state(myState);
    expect(s.getState()).toBe(myState);
    s.setState({ fetching: true });
    expect(s.getState()).toStrictEqual({ fetching: true, error: true });
  });

  it('should call a state setter function with the last state', () => {
    const myState = { fetching: false, error: true };
    const s = state(myState);
    const spy = jest.fn(() => false);
    s.setState(spy);
    expect(spy).toHaveBeenCalledWith(myState);
    expect(s.getState()).toBe(false);
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
    const selector = createSelector(
      ({ fetching }) => fetching,
      ({ data }) => data.find(({ id }) => id === 2).a,
      spy
    );

    s.subscribe(selector);
    expect(spy).toHaveBeenCalledWith(false, 'b');

    spy.mockClear();

    s.setState(state => ({
      ...state,
      data: [...state.data, { id: 4, a: 'd' }],
    }));

    expect(spy).not.toHaveBeenCalled();
    s.setState({ fetching: true });
    expect(spy).toHaveBeenCalledWith(true, 'b');
  });
});
