export type StateSetter<T> = (state: T) => T;

type Unsubscribe = () => void;
type Subscriber<T> = (state: T) => void;

export function memo<T extends Function>(fn: T): T;
export interface Stateful<T> {
  getState(): T;
  setState(next: StateSetter<T>): void;
  subscribe(subscriber: Subscriber<T>): Unsubscribe;
}

export function state<T>(state: T): Stateful<T>;

type Selector<T, R> = (arg: T) => R;

export function createSelector<T, S>(
  combiner: Selector<T, S>,
): (arg: T) => S;

export function createSelector<T, R1, S>(
  selectorA: Selector<T, R1>,
  combiner: (arg: R1) => S
): (arg: T) => S;

export function createSelector<T, R1, R2, S>(
  selectorA: Selector<T, R1>,
  selectorB: Selector<T, R2>,
  combiner: (arg1: R1, arg2: R2) => S
): (arg: T) => S;

export function createSelector<T, R1, R2, R3, S>(
  selectorA: Selector<T, R1>,
  selectorB: Selector<T, R2>,
  selectorC: Selector<T, R3>,
  combiner: (arg1: R1, arg2: R2, arg3: R3) => S
): (arg: T) => S;

export function createSelector<T, R1, R2, R3, R4, S>(
  selectorA: Selector<T, R1>,
  selectorB: Selector<T, R2>,
  selectorC: Selector<T, R3>,
  selectorD: Selector<T, R4>,
  combiner: (arg1: R1, arg2: R2, arg3: R3, arg4: R4) => S
): (arg: T) => S;
