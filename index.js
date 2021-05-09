const memo = fn => {
  let args, last;
  return (...inner) =>
    !args ||
    inner.length !== args.length ||
    !inner.every((a, i) => a === args[i])
      ? ((args = inner), (last = fn(...inner)))
      : last;
};

export const createSelector = (...fns) => {
  const memoed = memo(fns.pop());
  return !fns.length
    ? memoed
    : memo((...args) => memoed(...fns.map(a => a(...args))));
};

export const set = state => () => state;
export const patch = state => initial => ({ ...initial, ...state });

export const state = (state, subscribers = []) => ({
  getState: () => state,
  setState: set =>
    subscribers.reduce((acc, s) => (s(acc), acc), (state = set(state))),
  subscribe: s => (
    s(state),
    subscribers.push(s),
    () => (subscribers = subscribers.filter(f => f !== s))
  ),
});
