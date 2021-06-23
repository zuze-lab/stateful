export const memo = (fn, cmp = (a, b) => a === b, args, last) => (...inner) =>
  args && inner.length === args.length && inner.every((a, i) => cmp(a, args[i]))
    ? last
    : (last = fn(...(args = inner)));

export const createSelectorFactory = cmp => (...fns) =>
  (m =>
    fns.length ? memo((...args) => m(...fns.map(a => a(...args))), cmp) : m)(
    memo(fns.pop(), cmp)
  );

export const createSelector = createSelectorFactory();

export const state = (
  state,
  subscribers = [],
  batchDepth = 0,
  notify = () => batchDepth || subscribers.map(s => s(state))
) => ({
  getState: () => state,
  batch: fn => fn(() => --batchDepth || notify(), ++batchDepth),
  setState: set =>
    notify((state = typeof set === 'function' ? set(state) : set)),
  subscribe: s => (
    batchDepth || s(state),
    subscribers.push(s),
    () => (subscribers = subscribers.filter(f => f !== s))
  ),
});
