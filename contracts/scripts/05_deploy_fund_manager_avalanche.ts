import { ethers } from "hardhat";

const SapphireEventRouterAddress =
  "0x28a8c492Ebd9123a91Cbc03Ae9c54403Ee109CE0" as any;

async function main() {
  const FundManager = await ethers.getContractFactory("FundManager");
  const fundManager = await FundManager.deploy(SapphireEventRouterAddress);
  console.log(
    "FundManager deployed to avalanche:",
    await fundManager.getAddress()
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
