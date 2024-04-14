import { ethers } from "hardhat";

export const Tokens = [
  { name: "1INCH Token", symbol: "1INCH" },
  { name: "ChainLink Token", symbol: "LINK" },
  { name: "Dai Stablecoin", symbol: "DAI" },
  { name: "USDC", symbol: "USDC" },
  { name: "Tether USD ", symbol: "USDT" },
];

async function main() {
  const MyERC20 = await ethers.getContractFactory("MyERC20");
  for (const t of Tokens) {
    const token = await MyERC20.deploy(
      ethers.parseEther("1000"),
      t.name,
      t.symbol
    );
    console.log(`${t.symbol} deployed`, await token.getAddress());
  }

  console.log("");
  console.log("done");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
