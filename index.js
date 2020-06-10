const callOnce = (fn, i = 0) => () => i++ || fn();

const defCheck = (a, b) => a === b;

const memo = (fn, check = defCheck) => {
  let args, last;
  return (...inner) =>
    !args ||
    inner.length !== args.length ||
    !inner.every((a, i) => check(a, args[i]))
      ? ((args = inner), (last = fn(...inner)))
      : last;
};

export const createSelectorFactory = check => (...fns) => {
  const memoed = memo(fns.pop(), check);
  // this line allows us to act like reselect where the first argument can be an array of dependencies
  const deps = !fns[0] || fns[0].constructor !== Array ? fns : fns[0];
  return memo(
    (...args) => memoed(...(deps.length ? deps.map(a => a(...args)) : args)),
    check
  );
};

export const createSelector = createSelectorFactory();

export const state = state => {
  const subscribers = [];
  let batchDepth = 0;

  const notify = () => batchDepth || subscribers.forEach(s => s(state));
  const done = () => --batchDepth || notify();

  const getState = () => state;
  const setState = next => {
    state = typeof next === 'function' ? next(state) : { ...state, ...next };
    notify();
  };
  const batch = then => {
    ++batchDepth;
    const next = then.length ? { then } : then();
    return next && next.then ? next.then(callOnce(done)) : (done(), next);
  };
  const subscribe = subscriber => {
    subscriber(state);
    const idx = subscribers.push(subscriber);
    return callOnce(() => subscribers.splice(idx - 1, 1));
  };

  return { setState, getState, batch, subscribe };
};
