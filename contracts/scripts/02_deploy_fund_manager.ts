import { ethers } from "hardhat";

async function main() {
  const FundManager = await ethers.getContractFactory("FundManager");
  const fundManager = await FundManager.deploy();
  console.log("FundManager deployed:", await fundManager.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
