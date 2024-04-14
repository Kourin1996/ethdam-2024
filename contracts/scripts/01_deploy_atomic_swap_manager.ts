import { ethers } from "hardhat";

async function main() {
  const AtomicSwapManager = await ethers.getContractFactory(
    "AtomicSwapManager"
  );
  const atomicSwapManager = await AtomicSwapManager.deploy(
    ethers.keccak256(ethers.toBeHex(new Date().getTime()))
  );
  console.log(
    "AtomicSwapManager deployed to:",
    await atomicSwapManager.getAddress()
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
