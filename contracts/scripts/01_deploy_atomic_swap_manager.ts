import { ethers } from "hardhat";
import crypto from "crypto";

async function main() {
  const AtomicSwapManager = await ethers.getContractFactory(
    "AtomicSwapManager"
  );
  const atomicSwapManager = await AtomicSwapManager.deploy(
    "0x" + crypto.randomBytes(32).toString("hex")
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
