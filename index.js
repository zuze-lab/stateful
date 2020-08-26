const defCheck = (a, b) => a === b;

const memo = (fn, check = defCheck, args, last) => (...inner) =>
  !args ||
  inner.length !== args.length ||
  !inner.every((a, i) => check(a, args[i]))
    ? ((args = inner), (last = fn(...inner)))
    : last;

export const createSelectorFactory = check => (...fns) =>
  ((memoed, deps) =>
    memo(
      (...args) => memoed(...(deps.length ? deps.map(a => a(...args)) : args)),
      check
    ))(memo(fns.pop(), check), fns);

export const createSelector = createSelectorFactory();

export const state = (state, subscribers = []) => ({
  getState: () => state,
  setState: next =>
    subscribers.reduce(
      (a, s) => (s(a), a),
      (state = typeof next === 'function' ? next(state) : { ...state, ...next })
    ),
  subscribe: s => {
    s(state);
    subscribers.push(s);
    return () => (subscribers = subscribers.filter(f => f !== s));
  },
});
