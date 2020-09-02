export type Patch<T> = Partial<T>;
export type PatchFn<T> = (state: T) => T;
export type StateSetter<T> = Patch<T> | PatchFn<T>;

type Unsubscribe = () => void;
type Subscriber<T> = (state: T) => void;

export interface Stateful<T> {
  getState(): T;
  setState(next: StateSetter<T>): void;
  subscribe(subscriber: Subscriber<T>): Unsubscribe;
}

export type Checker = <T>(a: T, b: T) => boolean;

export function defaultChecker(a: any, b: any): boolean;

export function state<T>(state: T): Stateful<T>;

type Selector<T, R> = (arg: T) => R;

export function createSelector<T, S>(combiner: Selector<T, S>): (arg: T) => S;

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

export function createSelector<T, R1, S>(
  selectors: [Selector<T, R1>],
  combiner: (arg: R1) => S
): (arg: T) => S;

export function createSelector<T, R1, R2, S>(
  selectors: [Selector<T, R1>, Selector<T, R2>],
  combiner: (arg1: R1, arg2: R2) => S
): (arg: T) => S;

export function createSelector<T, R1, R2, R3, S>(
  selectors: [Selector<T, R1>, Selector<T, R2>, Selector<T, R3>],
  combiner: (arg1: R1, arg2: R2, arg3: R3) => S
): (arg: T) => S;

export function createSelector<T, R1, R2, R3, R4, S>(
  selectors: [
    Selector<T, R1>,
    Selector<T, R2>,
    Selector<T, R3>,
    Selector<T, R4>
  ],
  combiner: (arg1: R1, arg2: R2, arg3: R3, arg4: R4) => S
): (arg: T) => S;

export type ResultComparator<R> = (a: R, b: R, check: Checker) => R;

type FunctionReturning<T> = (...args: any[]) => T;

export function memo<T, R extends FunctionReturning<T>>(
  fn: R,
  check?: Checker,
  resultComparator?: ResultComparator<ReturnType<R>>
): R;

export function createSelectorFactory<R>(
  check?: Checker,
  resultChecker?: ResultComparator<R>
): typeof createSelector;
