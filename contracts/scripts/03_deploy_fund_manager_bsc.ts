import { ethers } from "hardhat";

const SapphireEventRouterAddress =
  "0x789d7FF69260aa7486510CFc2946c13adAE4b0CC" as any;

async function main() {
  const FundManager = await ethers.getContractFactory("FundManager");
  const fundManager = await FundManager.deploy(SapphireEventRouterAddress);
  console.log("FundManager deployed to BSC:", await fundManager.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
