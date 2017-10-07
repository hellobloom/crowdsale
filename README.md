# Bloom Token

## Set up

Install dependencies:

```sh
$ yarn
$ ./node_modules/.bin/truffle install
```

Migrate:

```sh
# Start the testrpc
$ ./node_modules/.bin/testrpc --gasLimit 100000000
# In a separate terminal window
$ ./node_modules/.bin/truffle migrate
```

## Testing

To run the test suite:

```sh
# NOTE: Make sure you stop the testrpc started earlier,
# otherwise you will get an error here. :)
$ bin/test
```

NOTE: You can't do certain calls to the in-memory RPC when you write JS tests, unless they're a separate process. For example, you can't ask "What is the current block?". So we use `bin/test` to launch a separate process and then runs the tests, rather than `truffle test --network test`.
