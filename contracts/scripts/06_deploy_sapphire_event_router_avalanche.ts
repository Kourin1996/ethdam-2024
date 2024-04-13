import { ethers } from "hardhat";

const AtomicSwapManagerAddress =
  "0xaB3622E1278447666aFBE815576e3eCe4EA9FB4d" as any;
const AvalancheFundMangerAddress =
  "0x509FBe9a01aC050dc22aA73E3c8A71cA22bbed72" as any;

async function main() {
  const SapphireEventRouter = await ethers.getContractFactory(
    "SapphireEventRouter"
  );
  const sapphireEventRouter = await SapphireEventRouter.deploy(
    AvalancheFundMangerAddress,
    ethers.encodeBytes32String("avalanche-fuji"),
    0xa869,
    AtomicSwapManagerAddress
  );
  console.log(
    "SapphireEventRouter deployed to Sapphire for BSC:",
    await sapphireEventRouter.getAddress()
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
