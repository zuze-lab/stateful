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

export const patch = data => initial => ({ ...initial, ...data });
export const set = data => () => data;

export const state = (state, subscribers = []) => {
  let batchDepth = 0;
  const call = s => s(state);

  const notify = () => batchDepth || subscribers.forEach(call);
  const done = () => --batchDepth || notify();

  return {
    getState: () => state,
    setState: next =>
      notify((state = typeof next === 'function' ? next(state) : next)),
    batch: then => {
      ++batchDepth;
      const next = then.length ? { then } : then();
      return next && next.then
        ? next.then(memo(done, () => true))
        : (done(), next);
    },
    subscribe: s => {
      call(s);
      subscribers.push(s);
      return () => (subscribers = subscribers.filter(f => f !== s));
    },
  };
};
