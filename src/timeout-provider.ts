
export interface ITimeoutProvider {
  createTimeout(timeoutMillis: number, callback: () => void, ...args: any[]): () => void;
}

let _defaultTimeoutProvider = null;

/* istanbul ignore next */
if (typeof setTimeout === 'function' && typeof clearTimeout === 'function') {
  _defaultTimeoutProvider = function(timeoutMillis: number, callback: () => void, ...args: any[]) {
    const timeout = setTimeout(callback, timeoutMillis, ...args);
    return () => {
      clearTimeout(timeout);
    }
  }
}


export function createTimeout(timeoutMillis: number, callback: () => void, ...args: any[]) {
  return _defaultTimeoutProvider(timeoutMillis, callback, ...args);
}
