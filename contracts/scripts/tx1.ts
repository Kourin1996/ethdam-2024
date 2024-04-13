// Usage: pnpm hardhat run --network <network> scripts/run-vigil.ts

import { ethers } from "hardhat";
import crypto from "crypto";
import * as sapphire from "@oasisprotocol/sapphire-paratime";

const AtomicSwapManagerABI = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "seed",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "requestId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "fillerAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "fillerPrivateKey",
        type: "uint256",
      },
    ],
    name: "FillerPrivateKeyCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "requestId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "sourceChainId",
        type: "uint32",
      },
      {
        indexed: false,
        internalType: "address",
        name: "sourceTokenAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "sourceTokenAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "sourceAccount",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "targetChainId",
        type: "uint32",
      },
      {
        indexed: false,
        internalType: "address",
        name: "targetTokenAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "targetTokenAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "privateKey",
        type: "uint256",
      },
    ],
    name: "RequestCreated",
    type: "event",
  },
  {
    inputs: [],
    name: "AA",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "BB",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "GX",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "GY",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "PP",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "_numRequest",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "_requests",
    outputs: [
      {
        internalType: "bool",
        name: "created",
        type: "bool",
      },
      {
        internalType: "uint32",
        name: "sourceChainId",
        type: "uint32",
      },
      {
        internalType: "address",
        name: "sourceTokenAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "sourceTokenAmount",
        type: "uint256",
      },
      {
        internalType: "uint32",
        name: "targetChainId",
        type: "uint32",
      },
      {
        internalType: "address",
        name: "targetTokenAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "targetTokenAmount",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "deposited",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "filled",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "sourcePrivateKeyIndex",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "targetPrivateKeyIndex",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "requestId",
        type: "uint256",
      },
    ],
    name: "createNewFillerPrivateKey",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "sourceChainId",
        type: "uint32",
      },
      {
        internalType: "address",
        name: "sourceTokenAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "sourceTokenAmount",
        type: "uint256",
      },
      {
        internalType: "uint32",
        name: "targetChainId",
        type: "uint32",
      },
      {
        internalType: "address",
        name: "targetTokenAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "targetTokenAmount",
        type: "uint256",
      },
    ],
    name: "createNewRequest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "chainId",
        type: "uint32",
      },
      {
        internalType: "uint256",
        name: "requestId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "sourceAccountAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenAmount",
        type: "uint256",
      },
    ],
    name: "onDeposit",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "chainId",
        type: "uint32",
      },
      {
        internalType: "uint256",
        name: "requestId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "targetAccountAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenAmount",
        type: "uint256",
      },
    ],
    name: "onFill",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "requestId",
        type: "uint256",
      },
    ],
    name: "revealPrivateKey",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

function padLeft32(hex: string) {
  return "0".repeat(Math.max(0, 32 - hex.length)) + hex;
}

async function main() {
  const [signer1] = await ethers.getSigners();

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

  const tx1 = await atomicSwapManager.connect(signer1).createNewRequest(
    420, // optimism goerli
    "0x94b008aa00579c1307b0ef2c499ad98a8ce58e58",
    ethers.parseEther("0.5"),
    421613, // arbitrum testnet
    "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
    ethers.parseEther("0.5")
  );
  const receipt1 = await tx1.wait();

  console.log("tx1 confirmed");

  const iface = new ethers.Interface(AtomicSwapManagerABI);
  const requestCreatedEvent = receipt1?.logs
    ?.map((l) => iface.parseLog(l))
    .find((pl) => pl?.name === "RequestCreated");

  const requestId = requestCreatedEvent?.args[0]!;
  const sourceAccountAddress = requestCreatedEvent?.args[4]!;
  const sourceAccountPrivateKey = requestCreatedEvent?.args[8];
  console.log("source account address", sourceAccountAddress);
  console.log("source account private key", sourceAccountPrivateKey);

  const sourceAccountWallet = new ethers.Wallet(
    "0x" + padLeft32(sourceAccountPrivateKey.toString(16))
  );
  console.log("source account wallet address", sourceAccountWallet.address);

  try {
    const key = await atomicSwapManager.revealPrivateKey(0x0);
    console.log("revealed key, unexpected", key);
  } catch (_error) {
    console.log("error happened on calling revealPrivateKey, expected");
  }

  const tx2 = await atomicSwapManager
    .connect(signer1)
    .onDeposit(
      420,
      0x0,
      sourceAccountAddress,
      "0x94b008aa00579c1307b0ef2c499ad98a8ce58e58",
      ethers.parseEther("0.5")
    );

  await tx2.wait();

  console.log("tx2 confirmed");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
