const callOnce = fn => {
  let i = 0;
  return () => i++ || fn();
};

const asyncTick = (fn, done) => {
  const next = fn.length ? { then: fn } : fn();
  return next && next.then ? next.then(done) : (done(), next);
};

const fromArgs = a => Array.prototype.slice.call(a);

const memo = (fn, check) => {
  // default arg check is equality
  check = check || ((a, b) => a === b);
  let args = [],
    last,
    calls = 0;
  return function() {
    const inner = fromArgs(arguments);
    return calls++ === 0 ||
      inner.length !== args.length ||
      inner.some((a, idx) => !check(a, args[idx]))
      ? ((args = inner), (last = fn.apply(null, inner)))
      : last;
  };
};

const createSelectorFactory = check => {
  const m = fn => memo(fn, check);

  return function() {
    const fns = fromArgs(arguments);
    const memoed = m(fns.pop());
    // this line allows us to act like reselect where the first argument can be an array of dependencies
    const deps = (Array.isArray(fns[0]) ? fns[0] : fns).map(m);
    return m(function() {
      const a = f => f.apply(null, arguments);
      return memoed.apply(null, (deps.length ? deps : [i => i]).map(a));
    });
  };
};

export const createSelector = createSelectorFactory();

export const state = state => {
  const subscribers = [];
  let batchDepth = 0;

  const notify = () => batchDepth || subscribers.forEach(s => s(state));
  const done = () => --batchDepth || notify();

  const getState = () => state;
  const setState = next => {
    (state =
      typeof next === 'function'
        ? next(state)
        : Object.assign({}, state, next)),
      notify();
  };
  const batch = fn => ++batchDepth && asyncTick(fn, callOnce(done));
  const subscribe = subscriber => {
    subscriber(state);
    const idx = subscribers.push(subscriber);
    return callOnce(() => subscribers.splice(idx - 1, 1));
  };

  return { setState, getState, batch, subscribe };
};
