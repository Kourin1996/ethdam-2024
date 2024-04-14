"use client";

import { useEffect, useState } from "react";
import { useChainId, useSwitchChain } from "wagmi";
import * as sapphire from "@oasisprotocol/sapphire-paratime";
import { ethers } from "ethers";
import {
  ATOMIC_SWAP_MANAGER_ADDRESS,
  FUND_MANAGER_ARBITRUM_ADDRESS,
  FUND_MANAGER_OPTIMISM_ADDRESS,
} from "@/constants/contract";
import {
  ATOMIC_SWAP_MANAGER_ABI,
  FUND_MANAGER_ABI,
  MY_ERC20_ABI,
} from "@/constants/abi";
import { RequestListView } from "@/components/organisms/RequestListView";
import { sapphireTestnet } from "viem/chains";
import { ChainIds, ChainType } from "@/constants/chains";
import {
  TokenIdByChainAndTokenAddress,
  TokenIdToSymbol,
} from "@/constants/tokens";
import { DepositView } from "@/components/organisms/DepositView";
import { WaitingView } from "@/components/organisms/WaitingView";
import { CompletionView } from "@/components/organisms/CompletionView";

enum Mode {
  RequestList,
  Fill,
  WaitingConfirm,
  Result,
}

type Request = {
  readonly requestId: number;
  readonly sourceChainId: number;
  readonly sourceChain: string;
  readonly sourceChainName: string;
  readonly sourceTokenId: string;
  readonly sourceTokenAddress: string;
  readonly sourceTokenAmount: BigInt;
  readonly targetChainId: number;
  readonly targetChain: string;
  readonly targetChainName: string;
  readonly targetTokenId: string;
  readonly targetTokenAddress: string;
  readonly targetTokenAmount: BigInt;
  readonly deposited: boolean;
  readonly filled: boolean;
  readonly confirmed: boolean;
};

export const FillerScreen = () => {
  const [mode, setMode] = useState<Mode>(Mode.RequestList);

  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const [requests, setRequests] = useState<Request[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [accountAddress, setAccountAddress] = useState<string | null>(null);

  const [sourcePrivateKey, setSourcePrivateKey] = useState<string | null>(null);
  const [sourceAddress, setSourceAddress] = useState<string | null>(null);

  useEffect(() => {
    if (mode === Mode.RequestList && chainId !== sapphireTestnet.id) {
      return switchChain({ chainId: sapphireTestnet.id });
    }

    if (mode === Mode.Fill && chainId !== selectedRequest?.targetChainId) {
      return switchChain({ chainId: selectedRequest?.targetChainId! });
    }

    if (mode === Mode.WaitingConfirm && chainId !== sapphireTestnet.id) {
      return switchChain({ chainId: sapphireTestnet.id });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, switchChain, selectedRequest]);

  useEffect(() => {
    (async () => {
      const provider = sapphire.wrap(
        new ethers.BrowserProvider(window.ethereum)
      );
      const atomicSwapManager = new ethers.Contract(
        ATOMIC_SWAP_MANAGER_ADDRESS,
        ATOMIC_SWAP_MANAGER_ABI,
        await provider.getSigner()
      );

      const numRequest = Number(await atomicSwapManager._numRequest());
      const results = await Promise.all(
        new Array(numRequest).fill(null).map(async (_, index) => {
          const res = await atomicSwapManager._requests(index);

          const sourceChainId = Number(res[1]);
          const sourceTokenAddress = res[2] as string;
          const sourceTokenAmount = res[3] as BigInt;
          const targetChainId = Number(res[4]);
          const targetTokenAddress = res[5] as string;
          const targetTokenAmount = res[6] as BigInt;
          const deposited = res[7] as boolean;
          const filled = res[8] as boolean;
          const confirmed = res[9] as boolean;

          const sourceChain =
            sourceChainId === ChainIds["optimism"] ? "optimism" : "arbitrum";
          const sourceChainName =
            sourceChainId === ChainIds["optimism"] ? "Optimism" : "Arbitrum";
          const sourceTokenId =
            TokenIdByChainAndTokenAddress[sourceChain][sourceTokenAddress];

          const targetChain =
            targetChainId === ChainIds["optimism"] ? "optimism" : "arbitrum";
          const targetChainName =
            targetChainId === ChainIds["optimism"] ? "Optimism" : "Arbitrum";
          const targetTokenId =
            TokenIdByChainAndTokenAddress[targetChain][targetTokenAddress];

          return {
            requestId: index,
            sourceChainId,
            sourceChain,
            sourceChainName,
            sourceTokenId,
            sourceTokenAddress,
            sourceTokenAmount,
            targetChainId,
            targetChain,
            targetChainName,
            targetTokenId,
            targetTokenAddress,
            targetTokenAmount,
            deposited,
            filled,
            confirmed,
          } as const;
        })
      );

      setRequests(results.filter((r) => !r.confirmed));
    })();
  }, []);

  console.log("debug::requests", requests);

  const onSelectRequest = async (request: Request) => {
    console.log("debug::onSelectRequest", request);

    setSelectedRequest(request);

    const provider = sapphire.wrap(new ethers.BrowserProvider(window.ethereum));
    const atomicSwapManager = new ethers.Contract(
      ATOMIC_SWAP_MANAGER_ADDRESS,
      ATOMIC_SWAP_MANAGER_ABI,
      await provider.getSigner()
    );

    console.log("debug::call createNewFillerPrivateKey", request.requestId);

    const tx = await atomicSwapManager.createNewFillerPrivateKey(
      request.requestId
    );
    const receipt = await tx.wait();

    console.log("debug::call createNewFillerPrivateKey confirmed");

    const iface = new ethers.Interface(ATOMIC_SWAP_MANAGER_ABI);
    const fillerPrivateKeyCreated = receipt?.logs
      ?.map((l: any) => iface.parseLog(l))
      .find((pl: any) => pl?.name === "FillerPrivateKeyCreated");

    console.log(
      "debug::fillerPrivateKeyCreated event",
      fillerPrivateKeyCreated
    );

    const fillerAddress = fillerPrivateKeyCreated.args[2];

    console.log("debug::fillerAddress", fillerAddress);

    setAccountAddress(fillerAddress);
    setMode(Mode.Fill);
  };

  const onDepositSubmit = async () => {
    if (chainId !== selectedRequest?.targetChainId) {
      return switchChain({ chainId: selectedRequest?.targetChainId! });
    }

    const fundManagerAddress =
      selectedRequest.targetChain === "optimism"
        ? FUND_MANAGER_OPTIMISM_ADDRESS
        : FUND_MANAGER_ARBITRUM_ADDRESS;

    const provider = new ethers.BrowserProvider(window.ethereum);
    const erc20 = new ethers.Contract(
      selectedRequest.targetTokenAddress!,
      MY_ERC20_ABI,
      await provider.getSigner()
    );

    console.log("debug::call approve", [
      fundManagerAddress,
      selectedRequest.targetTokenAmount,
    ]);
    const tx1 = await erc20.approve(
      fundManagerAddress,
      selectedRequest.targetTokenAmount
    );
    await tx1.wait();
    console.log("debug::approved");

    const fundManager = new ethers.Contract(
      fundManagerAddress,
      FUND_MANAGER_ABI,
      await provider.getSigner()
    );

    console.log("debug::call deposit", [
      selectedRequest.requestId!,
      selectedRequest.targetTokenAddress!,
      (await provider.getSigner()).address,
      accountAddress,
      selectedRequest.targetTokenAmount!,
    ]);
    const tx2 = await fundManager.fill(
      selectedRequest.requestId!,
      selectedRequest.targetTokenAddress!,
      (
        await provider.getSigner()
      ).address,
      accountAddress,
      selectedRequest.targetTokenAmount!
    );
    await tx2.wait();

    console.log("debug::filled");

    // on fill
    switchChain(
      { chainId: sapphireTestnet.id },
      {
        onSuccess: async () => {
          const wrappedProvider = sapphire.wrap(
            new ethers.BrowserProvider(window.ethereum)
          );
          const atomicSwapManager = new ethers.Contract(
            ATOMIC_SWAP_MANAGER_ADDRESS,
            ATOMIC_SWAP_MANAGER_ABI,
            await wrappedProvider.getSigner()
          );

          console.log("debug::calling onFill", [
            selectedRequest.targetChainId!,
            selectedRequest.requestId!,
            accountAddress!,
            selectedRequest.targetTokenAddress!,
            selectedRequest.targetTokenAmount!,
          ]);

          const tx3 = await atomicSwapManager.onFill(
            selectedRequest.targetChainId!,
            selectedRequest.requestId!,
            accountAddress!,
            selectedRequest.targetTokenAddress!,
            selectedRequest.targetTokenAmount!
          );

          await tx3.wait();

          console.log("debug::onFill completed");

          setMode(Mode.WaitingConfirm);
        },
      }
    );
  };

  useEffect(() => {
    if (mode !== Mode.WaitingConfirm) {
      return;
    }

    const interval = setInterval(() => {
      (async () => {
        const wrappedProvider = sapphire.wrap(
          new ethers.BrowserProvider(window.ethereum)
        );
        const atomicSwapManager = new ethers.Contract(
          ATOMIC_SWAP_MANAGER_ADDRESS,
          ATOMIC_SWAP_MANAGER_ABI,
          await wrappedProvider.getSigner()
        );

        const res = await atomicSwapManager._requests(
          selectedRequest?.requestId!
        );

        console.log("debug::get request", res);

        const deposited = res[7] as boolean;
        const filled = res[8] as boolean;
        const confirmed = res[9] as boolean;

        if (deposited && filled && confirmed) {
          console.log("debug::confirmed");

          const wrappedProvider = sapphire.wrap(
            new ethers.BrowserProvider(window.ethereum)
          );
          const signer = await wrappedProvider.getSigner();
          const atomicSwapManager = new ethers.Contract(
            ATOMIC_SWAP_MANAGER_ADDRESS,
            ATOMIC_SWAP_MANAGER_ABI,
            signer
          );

          const privateKey = await atomicSwapManager.revealPrivateKey(
            selectedRequest?.requestId!,
            await signer.getAddress()
          );

          console.log("debug::privateKey", privateKey);

          const sourceAddress = await new ethers.Wallet(
            ethers.toBeHex(privateKey.toString())
          ).getAddress();

          console.log("debug::sourceAddress", sourceAddress);

          setSourceAddress(sourceAddress);
          setSourcePrivateKey(ethers.toBeHex(privateKey.toString()));
          setMode(Mode.Result);

          return;
        }
      })();
    }, 1500);

    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  switch (mode) {
    case Mode.RequestList:
      return (
        <RequestListView
          requests={requests}
          onSelectRequest={onSelectRequest}
        />
      );
    case Mode.Fill:
      return (
        <DepositView
          title="Fill Your Token"
          sourceChain={selectedRequest?.targetChain! as ChainType}
          sourceChainName={selectedRequest?.targetChainName!}
          sourceToken={selectedRequest?.targetTokenId!}
          sourceTokenAmount={ethers.formatEther(
            selectedRequest?.targetTokenAmount.toString()!
          )}
          sourceTokenSymbol={TokenIdToSymbol[selectedRequest!.targetTokenId]}
          sourceAccountAddress={accountAddress!}
          onSubmit={onDepositSubmit}
        />
      );
    case Mode.WaitingConfirm:
      return <WaitingView title="Waiting to be confirmed" />;
    case Mode.Result:
      return (
        <CompletionView
          chain={selectedRequest?.sourceChain! as ChainType}
          chainLabel={selectedRequest?.sourceChainName!}
          address={sourceAddress!}
          privateKey={sourcePrivateKey!}
        />
      );
    default:
      return null;
  }
};
