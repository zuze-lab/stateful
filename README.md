# @zuze/stateful

[![npm version](https://img.shields.io/npm/v/@zuze/stateful.svg)](https://npmjs.org/package/@zuze/stateful)
[![Coverage Status](https://coveralls.io/repos/github/zuze-lab/stateful/badge.svg)](https://coveralls.io/github/zuze-lab/stateful)
[![Build Status](https://travis-ci.com/zuze-lab/stateful.svg)](https://travis-ci.com/zuze-lab/stateful)
[![Bundle Phobia](https://badgen.net/bundlephobia/minzip/@zuze/stateful)](https://bundlephobia.com/result?p=@zuze/stateful)

## What is this?

It's a ridiculously tiny and highly performant state mangement solution for functional JS library developers. Often in libraries state needs to be maintained (form frameworks come to mind). The "single store" architecture from redux has won the day - when your application is small enough (and it almost always is) keeping all your state together is a wise decision - you always know the source of truth AND you can quickly determine what is updating that state (just look for the `setState` calls in your codebase!).


## Getting Started

1. Install it as a dependency in your JavaScript/Typescript library project

```bash
npm install @zuze/stateful
# or
yarn install @zuze/stateful
```

2. Use it!

```js
import { state, createSelector } from '@zuze/stateful';

const initialState = {
    touched: {}
    fields: []
};

const myFormState = state(initialState);

const onFieldsUpdated = fields => {
    // the list of fields update, update your internal state
    myFormState.setState({
        invalid: fields.reduce((acc,fieldName) => ({
            ...acc,
            [fieldName]: state.getState().touched[fieldName] || false
        }),{})
    });
}

// whenever the list of fields update, call onFieldsUpdated
myFormState.subscribe(createSelector(({fields}) => fields,onFieldsUpdated)

```

## Further

To do...