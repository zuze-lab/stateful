export const defaultCheck = (a, b) => a === b;

const which = (a, b, check) => (check(a, b) ? a : b);

export const memo = (
  fn,
  check = defaultCheck,
  result = which,
  args,
  last,
  i = 0
) => (...inner) =>
  !args ||
  inner.length !== args.length ||
  !inner.every((a, i) => check(a, args[i]))
    ? ((args = inner),
      (last = !i++ ? fn(...inner) : result(last, fn(...inner), check)))
    : last;

export const createSelectorFactory = (check, result) => (...fns) =>
  ((memoed, deps) =>
    memo(
      (...args) => memoed(...(deps.length ? deps.map(a => a(...args)) : args)),
      check
    ))(
    memo(fns.pop(), check, result),
    !fns[0] || fns[0].constructor !== Array ? fns : fns[0]
  );

export const createSelector = createSelectorFactory();

export const state = (state, subscribers = []) => {
  let batchDepth = 0;

  const notify = () => batchDepth || subscribers.forEach(s => s(state));
  const done = () => --batchDepth || notify();

  return {
    getState: () => state,
    setState: next =>
      notify(
        (state =
          typeof next === 'function' ? next(state) : { ...state, ...next })
      ),
    batch: then => {
      ++batchDepth;
      const next = then.length ? { then } : then();
      return next && next.then
        ? next.then(memo(done, () => true))
        : (done(), next);
    },
    subscribe: s => {
      s(state);
      subscribers.push(s);
      return () => (subscribers = subscribers.filter(f => f !== s));
    },
  };
};
