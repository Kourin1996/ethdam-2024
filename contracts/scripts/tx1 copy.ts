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
  const [signer1, signer2] = await ethers.getSigners();

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

  const tx3 = await atomicSwapManager
    .connect(signer2)
    .createNewFillerPrivateKey(0x0);
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

  const tx4 = await atomicSwapManager
    .connect(signer2)
    .onFill(
      421613,
      0x0,
      targetAccountAddress,
      "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
      ethers.parseEther("0.5")
    );

  await tx4.wait();

  console.log("tx4 confirmed");

  try {
    const privateKey = await atomicSwapManager
      .connect(signer1)
      .revealPrivateKey(0x0);
    console.log("private key for account 1", privateKey);

    const account = new ethers.Wallet("0x" + privateKey.toString(16));
    console.log("address for account 1", account.address);
  } catch (error) {
    console.error("error happen 1, unexpected", error);
  }

  try {
    const privateKey = await atomicSwapManager
      .connect(signer2)
      .revealPrivateKey(0x0);
    console.log("private key for account 2", privateKey);

    const account = new ethers.Wallet("0x" + privateKey.toString(16));
    console.log("address for account 2", account.address);
  } catch (error) {
    console.error("error happen 2, unexpected", error);
  }

  // const Vigil = await ethers.getContractFactory("Vigil");
  // const vigil = await Vigil.deploy(await verifier.getAddress());
  // console.log("Vigil deployed to:", await vigil.getAddress());

  // const tx = await vigil.createSecret(
  //   "ingredient",
  //   30,
  //   Buffer.from("brussels sprouts")
  // );
  // console.log("Storing a secret in", tx.hash);
  // await tx.wait();
  // try {
  //   console.log("Checking the secret");
  //   await vigil.connect(ethers.provider).revealSecret.staticCall(0);
  //   console.log("Uh oh. The secret was available!");
  //   process.exit(1);
  // } catch (e: any) {
  //   console.log("failed to fetch secret:", e.message);
  // }
  // console.log("Waiting...");

  // await new Promise((resolve) => setTimeout(resolve, 30_000));
  // console.log("Checking the secret again");
  // await (await vigil.revealSecret(0)).wait();
  // const secret = await vigil.revealSecret.staticCallResult(0);
  // console.log(
  //   "The secret ingredient is",
  //   Buffer.from(secret[0].slice(2), "hex").toString()
  // );

  // await vigil.verifyProof(
  //   "0x14b3a2fa3187d345bc77e510430e34cf7cb4c5eedf8cff2f678c1b4f717e1201059310d1da5933506026ff8e94678ab08537141a9509620ee773e0149a3f9dd32145f3e9cb7a84b653c9f8f0d0282f7679f6c426bf5c8fc6261e7ac58d5cfd292d13aa2f4861e65d89f37088fcb4777c10206432835b7fc4612af06a2a68027513a913e860e0d9a4c5238b586c4cd29b675335f7495c56b94fd98d16cc4636fe07154de1ddcf0549d9eb4629ce786e41480efc14dc3f7f0917eb8963829f03800c6e62fbf35eec3e08d60faafeff38bfa648cf6d87b9ed51dc7cac0fee185290160a648ecf461f028421250ef116d28ce3abc2f13702d47a832df306edc7ac2027e74f4653421a4cd17271c8ae25d782cdb17b667621e1e86e72fe672d25494d13265e6ccf4b4f6b8c479fce3926e1273a477f97073f2e9fe6f1e06f8c54cc8a0e8b5cf84eb420bafdbb099c55111243748e2c513e7dde66eafe28f84b7483de098c19f6cef474a083475490d67605bcea14fece8b0661e37fd35893a0b1339c28e4495a5cc8bf42982ea09814fa60f7bd949017d521aa938da9338c03ac068b2a900388be126ee87bae1170f4a30c3d5cfd64bf804ff9516f9676bcaa11b90a2f98585230fc184f5e31658fca1dd59328f014db96d3c545d3eaa3f64e95add0249d73d94be4e690ae825aaf7fa532d8da4b55dd613e0709e10acbd5c4f2b98c1ff21840d28937aef708681a87625ecc5330a5b4a39a5b0e580bd5cf1d02591a1ebad45e524fe7eac05981089cf77f1dec31d91b81b73db92c671342194938450bb64a8f14547f18626df656016fc64a0a7acaead651b894df8f13ffb745b8031795a675d3f6630c07fca3c4517044037cbe79987306fb788b2cc7fc564655300c628b9f4b2cc90a56ea172df606ee21c88a03f5c3f2e4ff4a066feac6cb21c526938ec78349247d61ea03c133a2de7f26e015ec2fe5987f08ca0ffa247f42b619fa34e701767563d4b6e4dbafcb04d6a15f620b091695d9ff27a532e147624c241818e2dab8c072f83b8fd36d699fa9abeed5cb876186a050256764ac77d381029f1159647faa22a94906880443c37fdb64b426f0518e281d9d4fef887c42cb025799a713857131c8ca3f538ba02a50ef05dc414c12b2e85cb68ff594bb595a153ec9191a942af88cdad39395522259d268db2f728a8f649414c7e2bf83433a19d9078335e5244785c120b06f6e0d9d67cd7d2eb8f83d05a23551b57504e4fb0b6222a74f489d90ebfc78523a716152e23d1907ab804645d67325e6f6c8cc5909e21135325b39cb713bc241b490111cea2d6653227a1b29e6c6d1b4129002f01784018c15acf1a486306a905b8d574a8ce110066409b67461c50d8ab110f542152e4f7a7926d4de9c7b34298a210e1c80579e72befa5d04d17ac820d17637e8055cf234011af2dd66a63d992a5e939d1ab51d0616b03c3413d7c91afc1b45ca3032a7dbe673d738b35a46f08fe7eb49e594b2eebd691b1a5e86c6013c5c1f660d870ecba9b9ec3c7c8017eabed5ac40cbf1ef052af8762235031099e6557d7403dc00182b84944140211f90ffebd49402dad08df6f0e534708aa00c544ca8050726984556ce9927338852218dd36f7c239c26b2c8eafaf01a750c23facf07b8080b6b4e01a86c4c19f95c65bf8ddd6ba80fab8922085a4e1dc3ada87a28e8af08f03e56ac823f71006a66a9f1484b5b2c83305f7b25b9ac21124f2cf982c9a618e802938538b210bea0ff2ea8a7eec1f8dbe29549cb3fe13aa665f856c64c392ce3d2a98b737eada9163572014c042f1358e513a1f15c56e5e5c85668281e3d1581a1daf57b78a54da49a51c267f904274dd0984449cdee1fa7b94fa5c4f0822a228967065e6128adf6fd05ca7f0d0979c7ccb82fbdd4ade803feda14a082f50ab9e4680235e5bacd4c7b3254bd273a356a3a0c2d60786827af9235f8368b940b9eb770ad0fb8dfb3bd857686779529b9ddbee2867dd7c62afe33ba77906c8b0c838a7957e98c049a2e8fbab83203193e5143b8df9b37242e4cd53ef6ea4d820d685d8202c35f29809f99fee9ec7108c2c4c88f38b89682319b76c376442e7909d5115f575c1295e6db70ee2302b94ab0f6b535d443190a2460f0b178dcaa9d166a9b772899874b3b3f8ef1a055b6aff81ec5229adbab18e059fa9ac6bed9e90e325f8db20be445a8b2067cf3ce36e39f6020580790d41532b7817afcdd30ea052899bbc142ca113c23e7c973e9e9f20b7b5ab07991d0179f8f951fee7f861722504a08e7a28b9b5fce6543724eb733d4dd2f62efb5b9372ed2da71f989d679086efc9c082ae7479f8a9300e018779d92a11a96081873e9e2ccb07062da059b17627150e6a33a22b7cca1de6d9db41dbdd1487f20e0a379426a81c5355e14c1298902c8ed5c1aa444cdd1b4b02801f8a98e5251a7131a941b0582eedba730ba0272c5b862f85c38ec0bd960a0461fe82a9cf9d5dae06a987718d40a64494818068a01f7bf62a3b6c86a3625e7de2ee94f7a656f618e976d1137385411b669b203234ac38ad925d3af0a7fdf2c5c3fbd764467063af69aba65bc48349bb707311df05b92c38ec0e4d11f2278e579bd71e3def223f9f49c000c3566457c4f0a8d2acdcd756aa17736f6ae9e4e7f34d55672a74bc527db97561465fa74073e281e060b5d34cd303bae1c4f9c12488d72d0055f5083db135b7988322d57bfd8ab7511ad3b6710f0a04efa40df8c936768a6c04b3d8b0804902e3fe055cf68732ecd1d4f199954b104efd8322306de415e7d7b372a9234f5c4e2f78e7e47110db22515aee090bcc723ede2b406a2fb38d42e8de8d6a2444df2e9054ce2c0fb065e2d0e7dd2b3a7b1774a238554c985f56b146d549b33773fe1fb1a3cae1f7c29354e01742f9d5e2eec0a2107cfddccdbb66ef89b893adf7142f53bba5e586a8c254e1c436674ab21d60970d87da06e8a4b1d8e0e25d004f89877fa2c31242d404b14",
  //   0x2
  // );

  // console.log("Verified");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
