import { ethers } from "hardhat";

async function main() {
  const [signer] = await ethers.getSigners();
  const nonce = await ethers.provider.getTransactionCount(signer.address);
  const address = ethers.getCreateAddress({
    from: signer.address,
    nonce,
  });

  console.log("next contract address", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
