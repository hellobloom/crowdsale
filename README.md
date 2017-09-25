# Bloom Token

## Testing

To run the test suite:

```sh
$ bin/test
```

NOTE: You can't do certain calls to the in-memory RPC when you write JS tests, unless they're a separate process. For example, you can't ask "What is the current block?". So we use `bin/test` to launch a separate process and then runs the tests, rather than `truffle test --network test`.
