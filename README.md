# @zuze/stateful

[![npm version](https://img.shields.io/npm/v/@zuze/stateful.svg)](https://npmjs.org/package/@zuze/stateful)
[![Coverage Status](https://coveralls.io/repos/github/zuze-lab/stateful/badge.svg)](https://coveralls.io/github/zuze-lab/stateful)
[![Build Status](https://travis-ci.com/zuze-lab/stateful.svg)](https://travis-ci.com/zuze-lab/stateful)
[![Bundle Phobia](https://badgen.net/bundlephobia/minzip/@zuze/stateful)](https://bundlephobia.com/result?p=@zuze/stateful)

## What is this?

It's a [ridiculously tiny](https://bundlephobia.com/result?p=@zuze/stateful) and highly performant state mangement solution when you don't want to implement [redux](https://github.com/reduxjs/redux). It's supposed to be minimalistic (comes in most handy for a source of state for library developers) and extremely simple. It comes with everything you need (including a super tiny memoized selector implementation) to maintain your state.


### Getting Started

Install it as a dependency in your JavaScript/Typescript project

```bash
npm install @zuze/stateful
# or
yarn install @zuze/stateful
```

Or just pull it in from the browser:

```html
<script src="https://unpkg.com/@zuze/stateful"></script>
<script>
    const { state } = stateful;
    const myState = state('jim!');
    myState.subscribe(console.log); // jim!
</script>
```

### API

**`state<T>(initialState: T)`: Stateful<T>**

Create a stateful instance with an initial state. Returns the stateful interface:

- **`getState(): T`**
  Returns the current state.

- **`setState(stateSetter: StateSetter<T>): void`**
  Can be used to patch or set state:

  ```js
  import { state } from '@zuze/stateful';

  const s = state({fetching:false,error:false});
  s.setState({fetching:true}); // { fetching: true, error: false }
  s.setState(state => ({ ...state, fetching: false, data:'some data' })) // { fetching: false, error: false, data: 'some data' }
  ```

- **`subscribe(subscriberFunction: Subscriber<T>): Unsubscribe`**
  Register a subscriber function to be notified every time the state changes (see [selectors](#selectors)). Returns an unsubscribe function.
  ```js
  const s = state('jim');
  const unsub = s.subscribe(console.log); // logs jim
  s.setState(() => 'fred'); // logs fred
  unsub();
  s.setState(() => 'bill'); // nothing logged
  ```
  

- **`batch(batchFunction: <R>(done?: () => void) => R): R`**
  Sometimes we may want to update state several times but prevent subscribers from hearing the "intermediate" states. This is done via `batch`. While a `batchFunction` is running, any updates to the state will not be broadcast to subscribers.

  ```js
  const s = state({first:[],second:[],third:[]});

  // async/await example
  s.batch(async () => {
      // none of these intermediate states will be broadcast to subscribers
      s.setState({ first: await apiCallA(); });
      s.setState({ second: await apiCallB() });
      s.setState({ third: await apiCallC() });

      return 'my result';
  });

  // promise example (same as above)
  s.batch(() => Promise.all([
      apiCallA(),
      apiCallB(),
      apiCallC()
    ]).then(([first,second,third]) => s.setState({first,second,third}))
  );  

  // callback example
  s.batch(done => {
      Promise.all([apiCallA(),apiCallB(),apiCallC()])
        .then(([first,second,third]) => s.setState({first,second,third}))
        .finally(done);
  });

  ```
<a name="selector"></a>
**`createSelector(...selectors, combiner)`**

The purpose of a selector (popularized in [reselect](https://github.com/reduxjs/reselect)) is to minimize expensive computations through memoization. 

There is an alternate method for using selectors outside of minimizing expensive computations: because the combiner function only gets called when at least one of it's arguments change, it essentially becomes a callback for changes in the input selectors.

```js
import { createSelector, state } from '@zuze/stateful';

const myFetchingSelector = createSelector(
    ({ fetching }) => fetching,
    (fetching) => {
        console.log("fetching changed",fetching);
    }
);

const s = state({
    fetching: false,
    data: null,
    error: true;
});

s.subscribe(myFetchingSelector); // logs "fetching changed",false

(async() => {
    s.setState({ fetching: true }); // logs "fetching changed",true

    try {
        s.setState({data:await someAPICall() }) // not called!
    } catch {
        s.setState({error:true}) // not called!
    }

    s.setState({ fetching: false }); // logs "fetching changed",false
});

```

**`createSelectorFactory(checker: (a: any, b: any) => boolean)`** 

The default memoizer is a simple equality check `(a,b) => a === b`. If this level of memoization doesn't satisfy your requirements, you can use `createSelectorFactory` to create a `createSelector` that performs custom memoization. 

```js
import { isEqual } from 'lodash';
import { createSelectorFactory } from '@zuze/schema';

const createDeepEqualSelector = createSelectorFactory(isEqual);

const mySelector = createDeepEqualSelector(
    ({ fetching }) => {
        console.log('computing...');
        return fetching
    },
    ({ error }) => error,
    ({ data }) => data[0]
    (fetching,error,data) => fetching || error ? false : data
);

const firstState = { fetching:false, error:false, data:[1,2,3] };
const secondState = { fetching:false, error:false, data:[1,2,3] };

mySelector(firstState); // 1 - logs computing... 
mySelector(secondState); // 1 - no console - memoized!
```

#### About Selector Memoization

There are 2 levels of memoizations going on when creating a selector. 

1. The function returned from `createSelector` itself is memoized using `checker`
2. The `combiner` function is memoized using `checker`.

What this effectively means is:

1. If the function returns from `createSelector` is called with the same arguments neither the input selectors nor the combiner will be called
2. If the function returned from `createSelector` is called with different arguments, all input selectors will be called. If these executions result in the same arguments as the last time, the `combiner` will **NOT** be called.

