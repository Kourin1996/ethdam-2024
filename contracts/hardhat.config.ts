import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@oasisprotocol/sapphire-hardhat";

require("dotenv").config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 2000,
      },
    },
  },
  networks: {
    sapphire_testnet: {
      chainId: 0x5aff,
      url: "https://testnet.sapphire.oasis.io",
      accounts: process.env.PRIVATE_KEYS
        ? process.env.PRIVATE_KEYS.split(",")
        : [],
    },
    bsc_testnet: {
      chainId: 0x61,
      url: process.env.BSC_TESTNET_RPC!,
      accounts: process.env.PRIVATE_KEYS
        ? process.env.PRIVATE_KEYS.split(",")
        : [],
    },
    avalanche_c_testnet: {
      chainId: 0xa869,
      url: process.env.AVALANCHE_C_TESTNET_RPC!,
      accounts: process.env.PRIVATE_KEYS
        ? process.env.PRIVATE_KEYS.split(",")
        : [],
    },
  },
};

export default config;
