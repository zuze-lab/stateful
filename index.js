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

export const state = (state, subscribers = new Set()) => ({
  getState: () => state,
  setState: set => (
    (state = typeof set === 'function' ? set(state) : set),
    subscribers.forEach(s => s(state))
  ),
  subscribe: s => (s(state), subscribers.add(s), () => subscribers.delete(s)),
});
