
# Promise Timeout

Three methods for combining timeouts and promises.

1. `resolveAfter<T>(timeoutMillis, value:T): Promise<T>`
1. `rejectAfter<T>(timeoutMillis, error:T):  Promise<T>`
1. `promiseTimeout<T>(promise: Promise<T>, timeoutMillis, value:T): Promise<T>`

## Examples
Some examples are below.

### Example: Wait some time in an async function.

```
// wait a minute!

await resolveAfter(60*1000);
```

### Example: Find a fast server or reject.

```
// find the fastest server or reject with an error

const timeoutP = rejectAfter(2*1000, new Error('no answer'));
const serverA = fetch('https://server-a.example.com/something').then(unpackResult);
const serverB = fetch('https://server-b.example.com/something').then(unpackResult);

const result = await Promise.race(serverA, serverB, timeoutP);
```

### Example: Collect results or reject.

```
// collect all results or reject with an error

const timeoutP = rejectAfter(2*1000, new Error('too slow'));
const serverA = fetch('https://server-a.example.com/something').then(unpackResult);
const serverB = fetch('https://server-b.example.com/something').then(unpackResult);

const result = await Promise.all(serverA, serverB, timeoutP);
```

### Example: Timeout for a single promise.
```
// get the server's version or time out and use what you have
const result = await timeoutPromise(fetch('https://service.example.org/something').then(unpackResult), 500, oldValue);

// if server answers within 0.5s, `result` is from server
// otherwise, it's `oldValue`
```

### Helper function used in examples

This is the `unpackResult` function that I used to keep the examples short(-er).

```
function unpackResult(response: Response): string {
  if (response.status >= 200 && response.status < 300) {
    // one of the success codes
    return response.text();
  } else {
    return Promise.reject(new Error(`Server responded with status ${response.status}`)):
  }
}
```
