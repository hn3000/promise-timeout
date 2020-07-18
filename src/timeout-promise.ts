import { createTimeout } from "./timeout-provider";

export function timeoutPromise<T>(promise, timeoutMillis: number, fallback: T = undefined) {
  let resolve, reject;
  let timeoutP = new Promise<T>((res,rej) => {
    resolve = res;
    reject = rej;
  });

  let cancelTimeout;
  if (fallback) {
    cancelTimeout = createTimeout(timeoutMillis, resolve, fallback);
  } else {
    cancelTimeout = createTimeout(timeoutMillis, () => reject(new Error(`Timeout triggered after ${timeoutMillis} milliseconds`)));
  }

  promise.then(() => cancelTimeout());

  return Promise.race([promise, timeoutP]);
}

export function resolveAfter<T>(timeoutMillis: number, value: T = undefined) {
  let resolve, reject;
  let timeoutP = new Promise<T>((res,rej) => {
    resolve = res;
    reject = rej;
  });

  createTimeout(timeoutMillis, resolve, value);

  return timeoutP;
}

export function rejectAfter<T>(timeoutMillis: number, error: T = undefined) {
  let resolve, reject;
  let timeoutP = new Promise<T>((res,rej) => {
    resolve = res;
    reject = rej;
  });

  createTimeout(timeoutMillis, reject, error);

  return timeoutP;
}