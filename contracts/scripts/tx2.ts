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

  const atomicSwapManager = await ethers.getContractAt(
    "AtomicSwapManager",
    "0x6535461d308a2D5557487ea40f73bC866E676202"
  );
  const iface = new ethers.Interface(AtomicSwapManagerABI);

  const tx3 = await atomicSwapManager.createNewFillerPrivateKey(0x0);
  const receipt3 = await tx3.wait();
  const fillerPrivateKeyCreatedEvent = receipt3?.logs
    ?.map((l) => iface.parseLog(l))
    .find((pl) => pl?.name === "FillerPrivateKeyCreated");

  console.log("tx3 confirmed");

  const targetAccountAddress = fillerPrivateKeyCreatedEvent?.args[2]!;
  console.log("target account address", targetAccountAddress);

  const targetAccountPrivateKey = fillerPrivateKeyCreatedEvent?.args[3]!;
  console.log("target account private key", targetAccountPrivateKey);

  const targetAccountWallet = new ethers.Wallet(
    "0x" + padLeft32(targetAccountPrivateKey.toString(16))
  );
  console.log("target account wallet address", targetAccountWallet.address);

  const tx4 = await atomicSwapManager.onFill(
    421613,
    0x0,
    targetAccountAddress,
    "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
    ethers.parseEther("0.5")
  );

  await tx4.wait();

  console.log("tx4 confirmed");

  // try {
  //   const privateKey = await atomicSwapManager
  //     .connect(signer1)
  //     .revealPrivateKey(0x0);
  //   console.log("private key for account 1", privateKey);

  //   const account = new ethers.Wallet("0x" + privateKey.toString(16));
  //   console.log("address for account 1", account.address);
  // } catch (error) {
  //   console.error("error happen 1, unexpected", error);
  // }

  try {
    const privateKey = await atomicSwapManager.revealPrivateKey(0x0);
    console.log("private key for account 2", privateKey);

    const account = new ethers.Wallet("0x" + privateKey.toString(16));
    console.log("address for account 2", account.address);
  } catch (error) {
    console.error("error happen 2, unexpected", error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
