// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/lib/contracts/libraries/TransferHelper.sol";

contract UniswapV2Adapter {
    using TransferHelper for address;

    address private _router;

    /**
     * @dev Sets the value for `_router`.
     *
     * @param router The address of the UniswapV2Router02.
     *
     * @notice `router` value are immutable: they can
     * only be set once during construction
     */
    constructor(address router) public {
        _router = router;
    }

    /**
     * @dev Returns `_router` value.
     *
     * @return router address The address of the UniswapV2Router02.
     */
    function getRouter() public view returns (address router) {
        return _router;
    }

    /**
     * @dev Calculates all subsequent maximum output token
     * amounts by calling `getReserves` for each pair of
     * token addresses in the path in turn, and using these
     * to call `getAmountOut`.
     *
     * @param amountIn The amount of input tokens to send.
     *
     * @param path Array of token addresses.
     *
     * @return amounts The input token amount and all
     * subsequent output token amounts.
     */
    function getAmountsOut(uint256 amountIn, address[] memory path)
        public
        view
        returns (uint256[] memory amounts)
    {
        return IUniswapV2Router02(_router).getAmountsOut(amountIn, path);
    }

    /**
     * @dev Swaps an exact amount of tokens for as much ETH
     * as possible, along the route determined by the path.
     * The first element of path is the input token, the
     * last must be WETH, and any intermediate elements
     * represent intermediate pairs to trade through
     * (if, for example, a direct pair does not exist).
     *
     * @param amountIn The amount of input tokens to send.
     *
     * @param amountOutMin The minimum amount of output
     * tokens that must be received for the transaction
     * not to revert.
     *
     * @param path An array of token addresses.
     * `path.length must be >= 2`. Pools for each
     * consecutive pair of addresses must exist and have
     * liquidity.
     *
     * @param to Recipient of ETH.
     *
     * @param deadline Unix timestamp after which the
     * transaction will revert.
     *
     * @return amounts The input token amount and all
     * subsequent output token amounts.
     */
    function swapExactTokensForETH(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts) {
        path[0].safeTransferFrom(msg.sender, address(this), amountIn);

        uint256 balance = IERC20(path[0]).balanceOf(address(this));
        path[0].safeApprove(_router, balance);

        return
            IUniswapV2Router02(_router).swapExactTokensForETH(
                amountIn,
                amountOutMin,
                path,
                to,
                deadline
            );
    }

    /**
     * @dev Swaps an exact amount of tokens for as much ETH
     * as possible, along the route determined by the path.
     * The first element of path is the input token, the
     * last must be WETH, and any intermediate elements
     * represent intermediate pairs to trade through
     * (if, for example, a direct pair does not exist).
     *
     * @param amountOutMin The minimum amount of output
     * tokens that must be received for the transaction
     * not to revert.
     *
     * @param path An array of token addresses.
     * `path.length must be >= 2`. Pools for each
     * consecutive pair of addresses must exist and have
     * liquidity.
     *
     * @param to Recipient of the output tokens.
     *
     * @param deadline Unix timestamp after which the
     * transaction will revert.
     *
     * @return amounts The input token amount and all
     * subsequent output token amounts.
     */
    function swapExactETHForTokens(
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external payable returns (uint256[] memory amounts) {
        return
            IUniswapV2Router02(_router).swapExactETHForTokens{
                value: msg.value
            }(amountOutMin, path, to, deadline);
    }
}
