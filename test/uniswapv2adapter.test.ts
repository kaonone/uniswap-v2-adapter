import {
  UniswapV2FactoryInstance,
  UniswapV2Router02Instance,
  UniswapV2PairInstance,
  Weth9Instance,
  Erc20Instance,
  UniswapV2AdapterInstance,
} from "../types/truffle-contracts";

const BN = require("bn.js");
const chai = require("chai");
const { expect } = require("chai");

// Enable and inject BN dependency
chai.use(require("chai-bn")(BN));

const tokenSupplyAmount = web3.utils.toWei("100");
const tokenLiquidityAmount = web3.utils.toWei("10");
const ethLiquidityAmount = web3.utils.toWei("5");
const deadline = web3.utils.toWei("10");
const tokenAmount = web3.utils.toWei("1");
const ethAmount = web3.utils.toWei("1");

const UniswapV2Factory = artifacts.require("UniswapV2Factory");
const ERC20 = artifacts.require("ERC20");
const UniswapV2Pair = artifacts.require("UniswapV2Pair");
const UniswapV2Router02 = artifacts.require("UniswapV2Router02");
const WETH9 = artifacts.require("WETH9");
const UniswapV2Adapter = artifacts.require("UniswapV2Adapter");

contract("UniswapV2", ([acc1, acc2]) => {
  let uniswapV2FactoryInstance: UniswapV2FactoryInstance;
  let erc20Instance: Erc20Instance;
  let uniswapV2Router02Instance: UniswapV2Router02Instance;
  let weth9Instance: Weth9Instance;
  let uniswapV2PairInstance: UniswapV2PairInstance;
  let uniswapV2AdapterInstance: UniswapV2AdapterInstance;

  beforeEach(async () => {
    uniswapV2FactoryInstance = await UniswapV2Factory.new(acc1);
    erc20Instance = await ERC20.new(tokenSupplyAmount);
    weth9Instance = await WETH9.new();
    uniswapV2Router02Instance = await UniswapV2Router02.new(
      uniswapV2FactoryInstance.address,
      weth9Instance.address,
    );
    uniswapV2AdapterInstance = await UniswapV2Adapter.new(
      uniswapV2Router02Instance.address,
    );

    await uniswapV2FactoryInstance.createPair(
      erc20Instance.address,
      weth9Instance.address,
      { from: acc1 },
    );

    const uniswapV2PairInstanceAddress = await uniswapV2FactoryInstance.getPair(
      erc20Instance.address,
      weth9Instance.address,
    );

    uniswapV2PairInstance = await UniswapV2Pair.at(
      uniswapV2PairInstanceAddress,
    );

    await erc20Instance.approve(
      uniswapV2Router02Instance.address,
      tokenLiquidityAmount,
      { from: acc1 },
    );

    await uniswapV2Router02Instance.addLiquidityETH(
      erc20Instance.address,
      tokenLiquidityAmount,
      tokenLiquidityAmount,
      ethLiquidityAmount,
      acc1,
      deadline,
      {
        from: acc1,
        value: ethLiquidityAmount,
      },
    );
  });

  it("should add liqudity", async () => {
    const [r1, r2] = await uniswapV2PairInstance.getReserves();

    expect(r1).to.be.a.bignumber.that.equals(tokenLiquidityAmount);
    expect(r2).to.be.a.bignumber.that.equals(ethLiquidityAmount);
  });

  it("should swap tokens to eth", async () => {
    const balances = async (address: string) => ({
      token: await erc20Instance.balanceOf(address),
      eth: await web3.eth.getBalance(address),
    });

    const { eth: beforeBalance } = await balances(acc2);

    await erc20Instance.transfer(acc2, tokenAmount, { from: acc1 });

    await erc20Instance.approve(uniswapV2AdapterInstance.address, tokenAmount, {
      from: acc2,
    });

    const [
      ,
      amountOutMin,
    ] = await uniswapV2AdapterInstance.getAmountsOut(tokenAmount, [
      erc20Instance.address,
      weth9Instance.address,
    ]);

    await uniswapV2AdapterInstance.swapExactTokensForETH(
      tokenAmount,
      amountOutMin,
      [erc20Instance.address, weth9Instance.address],
      acc2,
      deadline,
      {
        from: acc2,
      },
    );

    const { eth: afterBalance } = await balances(acc2);

    expect(afterBalance).to.be.a.bignumber.that.above(new BN(beforeBalance));
  });

  it("should swap eth to tokens", async () => {
    const balances = async (address: string) => ({
      token: await erc20Instance.balanceOf(address),
      eth: await web3.eth.getBalance(address),
    });

    const { token: beforeBalance } = await balances(acc2);

    const [
      ,
      amountOutMin,
    ] = await uniswapV2AdapterInstance.getAmountsOut(ethAmount, [
      weth9Instance.address,
      erc20Instance.address,
    ]);

    await uniswapV2AdapterInstance.swapExactETHForTokens(
      amountOutMin,
      [weth9Instance.address, erc20Instance.address],
      acc2,
      deadline,
      {
        from: acc2,
        value: ethAmount,
      },
    );

    const { token: afterBalance } = await balances(acc2);

    expect(afterBalance).to.be.a.bignumber.that.equals(amountOutMin);
  });
});
