# UniswapV2 Adapter

[![Build Status](https://travis-ci.com/akropolisio/uniswap-v2-adapter.svg?branch=master)](https://travis-ci.com/akropolisio/uniswap-v2-adapter)
[![codecov](https://codecov.io/gh/akropolisio/uniswap-v2-adapter/branch/master/graph/badge.svg)](https://codecov.io/gh/akropolisio/uniswap-v2-adapter)

## Developer Tools 🛠️

- [Truffle](https://trufflesuite.com/)
- [TypeChain](https://github.com/ethereum-ts/TypeChain)
- [Openzeppelin Contracts](https://openzeppelin.com/contracts/)

## Start

Create `.infura` and `.secret` files.

Install the dependencies:

```bash
$ yarn
```

## Tests

```bash
$ yarn test
```

## Coverage

```bash
$ yarn coverage
```

## Deploying

Deploy to Kovan:

```bash
$ NETWORK=kovan yarn deploy
```

## Verifying Contract Code

```bash
$ NETWORK=kovan yarn run verify YourContractName
```

# Docs

## constructor - read

| name   | type    | description                           |
| ------ | ------- | ------------------------------------- |
| router | address | The address of the UniswapV2Router02. |

Sets the value for `_router`.
`_router` value is immutable: they can only be set once during construction
Returns:
_No parameters_

## getAmountsOut - read

| name     | type      | description                         |
| -------- | --------- | ----------------------------------- |
| amountIn | uint256   | The amount of input tokens to send. |
| path     | address[] | Array of token addresses.           |

Calculates all subsequent maximum output token amounts by calling `getReserves` for each pair of token addresses in the path in turn, and using these to call `getAmountOut`.

Returns:
|name |type |description
|-----|-----|-----------
|amounts|uint256[]|The input token amount and all subsequent output token amounts.

## getRouter - read

_No parameters_
Returns `_router` value.

Returns:
|name |type |description
|-----|-----|-----------
|router|address|The address of the UniswapV2Router02.

## swapExactETHForTokens - read

| name         | type      | description                                                                                                                          |
| ------------ | --------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| amountOutMin | uint256   | The minimum amount of output tokens that must be received for the transaction not to revert.                                         |
| path         | address[] | An array of token addresses. `path.length must be >= 2`. Pools for each consecutive pair of addresses must exist and have liquidity. |
| to           | address   | Recipient of the output tokens.                                                                                                      |
| deadline     | uint256   | Unix timestamp after which the transaction will revert.                                                                              |

Swaps an exact amount of tokens for as much ETH as possible, along the route determined by the path. The first element of path is the input token, the last must be WETH, and any intermediate elements represent intermediate pairs to trade through (if, for example, a direct pair does not exist).

Returns:
|name |type |description
|-----|-----|-----------
|amounts|uint256[]|The input token amount and all subsequent output token amounts.

## swapExactTokensForETH - read

| name         | type      | description                                                                                                                          |
| ------------ | --------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| amountIn     | uint256   | The amount of input tokens to send.                                                                                                  |
| amountOutMin | uint256   | The minimum amount of output tokens that must be received for the transaction not to revert.                                         |
| path         | address[] | An array of token addresses. `path.length must be >= 2`. Pools for each consecutive pair of addresses must exist and have liquidity. |
| to           | address   | Recipient of ETH.                                                                                                                    |
| deadline     | uint256   | Unix timestamp after which the transaction will revert.                                                                              |

Swaps an exact amount of tokens for as much ETH as possible, along the route determined by the path. The first element of path is the input token, the last must be WETH, and any intermediate elements represent intermediate pairs to trade through (if, for example, a direct pair does not exist).

Returns:
|name |type |description
|-----|-----|-----------
|amounts|uint256[]|The input token amount and all subsequent output token amounts.
