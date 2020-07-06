const UniswapV2Router02 = artifacts.require("UniswapV2Router02");
const UniswapV2Adapter = artifacts.require("UniswapV2Adapter");

module.exports = async (deployer, network) => {
  if (network === "test" || network === "coverage") return;
  const uniswapV2Router02Instance = await deployer.deploy(UniswapV2Router02);
  await deployer.deploy(UniswapV2Adapter, uniswapV2Router02Instance.address);
};
