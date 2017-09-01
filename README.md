# Bloom Token #

## Testing ##

To run the test suite:

```sh
$ bin/test
```

NOTE: You can't do certain calls to the in-memory RPC when you write JS tests, unless they're a separate process. For example, you can't ask "What is the current block?". So we use `bin/test` to launch a separate process and then runs the tests, rather than `truffle test --network test`.

## Requirements ##

- Preallocate for founders
- Hard cap on ETH accepted
- Start at X block and reject deposits before that
- Allocate token to address that sent ether
- Discounts for early buyers
    - See [MANA discounting](http://i.imgur.com/cWcwhmM.png)
- Cost increases based on remaining supply. First hour price is fixed
    - See [Filecoin](https://coinlist.co/currencies/filecoin/overview)
- Softcap $5M
- Hardcap $50M
