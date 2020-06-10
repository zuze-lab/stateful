const Benchmark = require('benchmark');
const { createSelector: createReselector } = require('reselect');
const { createSelector } = require('./build/index');

const state = {
  first: {
    complicated: {
      level: [1, 2, 3, 4],
      data: [
        { id: 1, a: 'a' },
        { id: 2, a: 'b' },
        { id: 3, a: 'c' },
        { id: 4, a: 'd' },
      ],
    },
  },
  second: {
    nested: {
      level: {
        error: true,
        fetching: false,
      },
    },
  },
};

const results = [];
const onCycle = event => results.push(event);

const onComplete = ({ currentTarget }) => {
  Array(currentTarget.length)
    .fill(0)
    .map((o, idx) => {
      const x = currentTarget[`${idx}`];
      //   console.log(idx, x);
      return x;
    })
    .sort((a, b) => (a.hz < b.hz ? 1 : -1))
    .forEach(a => {
      console.log(
        `${a.name} ${a.hz} ± ${a.stats.rme.toFixed(2)}% ${
          a.stats.sample.length
        } samples`
      );
    });
};

const bench = new Benchmark.Suite();

const selector = [
  ({ first }) => first.complicated.level,
  ({ first }) => first.complicated.level[0],
  ({ first }) => first.complicated.data.find(({ id }) => id === 1).a,
  ({ second }) => second.nested,
  (...args) => args,
];

const useR = createReselector(...selector);
const useMine = createSelector(...selector);

bench
  .add('rselect (create)', () => createReselector(...selector))
  .add('rselect (use)', () => useR({ ...state }))
  .add('mine (create)', () => createSelector(...selector))
  .add('mine (use)', () => useMine({ ...state }))
  .on('cycle', onCycle)
  .on('complete', onComplete)
  .run({ async: true });
