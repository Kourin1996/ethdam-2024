"use client";

import { RequestView } from "@/components/organisms/RequestView";
import { useEffect, useState } from "react";
import { sapphireTestnet } from "viem/chains";
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
import { ChainIds, ChainType, Chains } from "@/constants/chains";
import { DepositView } from "@/components/organisms/DepositView";
import {
  TokenAddressByChainAndTokenId,
  TokenType,
  Tokens,
} from "@/constants/tokens";
import { WaitingView } from "@/components/organisms/WaitingView";
import { ConfirmView } from "@/components/organisms/ConfirmView";
import { CompletionView } from "@/components/organisms/CompletionView";

enum Mode {
  Input,
  Deposit,
  WaitingFill,
  Confirm,
  Result,
}

export const RequesterScreen = () => {
  const [mode, setMode] = useState<Mode>(Mode.Input);

  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const [requestId, setRequestId] = useState<number | null>(null);
  const [sourceInfo, setSourceInfo] = useState<{
    chain: ChainType;
    chainId: number;
    chainName: string;
    tokenAddress: string;
    tokenAmountString: string;
    tokenAmount: BigInt;
    token: string;
    tokenSymbol: string;
    account: string;
  } | null>(null);
  const [targetInfo, setTargetInfo] = useState<{
    chain: ChainType;
    chainId: number;
    chainName: string;
    tokenAddress: string;
    tokenAmountString: string;
    tokenAmount: BigInt;
    token: string;
    tokenSymbol: string;
  } | null>(null);
  const [fillerAddress, setFillerAddress] = useState<string | null>(null);

  const [privateKey, setPrivateKey] = useState<string | null>(null);
  const [newAccount, setNewAccount] = useState<string | null>(null);

  console.log("debug::state", {
    requestId,
    sourceInfo,
    targetInfo,
    fillerAddress,
  });

  useEffect(() => {
    if (mode === Mode.Input && chainId !== sapphireTestnet.id) {
      return switchChain({ chainId: sapphireTestnet.id });
    }

    if (mode === Mode.Deposit && chainId !== sourceInfo?.chainId) {
      return switchChain({ chainId: sourceInfo?.chainId! });
    }

    if (mode === Mode.Confirm && chainId !== sapphireTestnet.id) {
      return switchChain({ chainId: sapphireTestnet.id });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, sourceInfo?.chainId, switchChain]);

  const [wrappedProvider, setWrappedProvider] = useState<
    (ethers.BrowserProvider & sapphire.SapphireAnnex) | null
  >(null);
  useEffect(() => {
    setWrappedProvider(
      sapphire.wrap(new ethers.BrowserProvider(window.ethereum))
    );
  }, []);

  const onRequestSubmit = async (
    sourceChain: string,
    sourceToken: string,
    sourceAmount: string,
    targetChain: string,
    targetToken: string,
    targetAmount: string
  ) => {
    if (chainId !== sapphireTestnet.id) {
      return switchChain({ chainId: sapphireTestnet.id });
    }

    console.log("request", {
      sourceChain,
      sourceToken,
      sourceAmount,
      targetChain,
      targetToken,
      targetAmount,
    });

    const atomicSwapManager = new ethers.Contract(
      ATOMIC_SWAP_MANAGER_ADDRESS,
      ATOMIC_SWAP_MANAGER_ABI,
      await wrappedProvider!.getSigner()
    );

    const sourceChainId = ChainIds[sourceChain as ChainType];
    const sourceTokenAddress =
      TokenAddressByChainAndTokenId[sourceChain as ChainType][
        sourceToken as TokenType
      ];
    const sourceTokenDecimals = 18;
    const sourceTokenAmountParsed = ethers.parseUnits(
      sourceAmount,
      sourceTokenDecimals
    );

    const targetChainId = ChainIds[targetChain as ChainType];
    const targetTokenAddress =
      TokenAddressByChainAndTokenId[targetChain as ChainType][
        targetToken as TokenType
      ];
    const targetTokenDecimals = 18;
    const targetTokenAmountParsed = ethers.parseUnits(
      targetAmount,
      targetTokenDecimals
    );

    console.log("debug::call createNewRequest", [
      sourceChainId,
      sourceTokenAddress,
      sourceTokenAmountParsed,
      targetChainId,
      targetTokenAddress,
      targetTokenAmountParsed,
    ]);

    const tx = await atomicSwapManager.createNewRequest(
      ChainIds[sourceChain as ChainType],
      sourceTokenAddress,
      ethers.parseUnits(sourceAmount, sourceTokenDecimals),
      ChainIds[targetChain as ChainType],
      targetTokenAddress,
      targetTokenAmountParsed
    );

    console.log("debug::tx", tx);

    const receipt = await tx.wait();

    console.log("receipt", receipt);

    const iface = new ethers.Interface(ATOMIC_SWAP_MANAGER_ABI);
    const requestCreatedEvent = receipt?.logs
      ?.map((l: any) => iface.parseLog(l))
      .find((pl: any) => pl?.name === "RequestCreated");

    console.log("debug:RequestCreatedEvent", requestCreatedEvent);

    const requestId = requestCreatedEvent.args[0];
    const sourceAccountAddress = requestCreatedEvent.args[4];

    setRequestId(Number(requestId));
    setSourceInfo({
      chain: sourceChain as ChainType,
      chainId: sourceChainId,
      chainName: Chains.find((c) => c.value === sourceChain)?.label!,
      tokenAddress: sourceTokenAddress,
      tokenAmountString: sourceAmount,
      tokenAmount: sourceTokenAmountParsed,
      account: sourceAccountAddress,
      token: sourceToken,
      tokenSymbol: Tokens.find((t) => t.value === sourceToken)?.label!,
    });
    setTargetInfo({
      chain: targetChain as ChainType,
      chainId: targetChainId,
      chainName: Chains.find((c) => c.value === targetChain)?.label!,
      tokenAddress: targetTokenAddress,
      tokenAmountString: targetAmount,
      tokenAmount: targetTokenAmountParsed,
      token: targetToken,
      tokenSymbol: Tokens.find((t) => t.value === targetToken)?.label!,
    });
    setMode(Mode.Deposit);

    switchChain({ chainId: sourceChainId });
  };

  const onDepositSubmit = async () => {
    if (chainId !== sourceInfo?.chainId) {
      return switchChain({ chainId: sourceInfo?.chainId! });
    }

    const fundManagerAddress =
      sourceInfo.chain === "optimism"
        ? FUND_MANAGER_OPTIMISM_ADDRESS
        : FUND_MANAGER_ARBITRUM_ADDRESS;

    const provider = new ethers.BrowserProvider(window.ethereum);

    const erc20 = new ethers.Contract(
      sourceInfo.tokenAddress,
      MY_ERC20_ABI,
      await provider.getSigner()
    );
    console.log("debug::call approve", [
      fundManagerAddress,
      sourceInfo.tokenAmount,
    ]);
    const tx1 = await erc20.approve(fundManagerAddress, sourceInfo.tokenAmount);
    await tx1.wait();

    console.log("debug::approved");

    const fundManager = new ethers.Contract(
      fundManagerAddress,
      FUND_MANAGER_ABI,
      await provider.getSigner()
    );
    console.log("debug::call deposit", [
      requestId!,
      sourceInfo.tokenAddress,
      (await provider.getSigner()).address,
      sourceInfo.account,
      sourceInfo.tokenAmount,
    ]);
    const tx2 = await fundManager.deposit(
      requestId!,
      sourceInfo.tokenAddress,
      (
        await provider.getSigner()
      ).address,
      sourceInfo.account,
      sourceInfo.tokenAmount
    );
    await tx2.wait();

    console.log("debug::deposited");

    switchChain(
      { chainId: sapphireTestnet.id },
      {
        onSuccess: async () => {
          const atomicSwapManager = new ethers.Contract(
            ATOMIC_SWAP_MANAGER_ADDRESS,
            ATOMIC_SWAP_MANAGER_ABI,
            await wrappedProvider!.getSigner()
          );

          console.log("debug::calling onDeposit", [
            sourceInfo.chainId!,
            requestId!,
            sourceInfo.account!,
            sourceInfo.tokenAddress,
            sourceInfo.tokenAmount,
          ]);

          const tx3 = await atomicSwapManager.onDeposit(
            sourceInfo.chainId!,
            requestId!,
            sourceInfo.account!,
            sourceInfo.tokenAddress!,
            sourceInfo.tokenAmount!
          );

          await tx3.wait();

          console.log("debug::onDeposit completed");

          setMode(Mode.WaitingFill);
        },
      }
    );
  };

  useEffect(() => {
    if (mode !== Mode.WaitingFill) {
      return;
    }

    const interval = setInterval(() => {
      (async () => {
        const atomicSwapManager = new ethers.Contract(
          ATOMIC_SWAP_MANAGER_ADDRESS,
          ATOMIC_SWAP_MANAGER_ABI,
          await wrappedProvider!.getSigner()
        );

        const res = await atomicSwapManager._requests(requestId!);

        console.log("debug::get request", res);

        const deposited = res[7] as boolean;
        const filled = res[8] as boolean;

        if (deposited && filled) {
          console.log("debug::filled");

          const atomicSwapManager = new ethers.Contract(
            ATOMIC_SWAP_MANAGER_ADDRESS,
            ATOMIC_SWAP_MANAGER_ABI,
            await wrappedProvider!.getSigner()
          );

          const filler = await atomicSwapManager.revealFiller(requestId!);

          setFillerAddress(filler);
          setMode(Mode.Confirm);

          return;
        }
      })();
    }, 1500);

    return () => {
      clearInterval(interval);
    };
  }, [mode, requestId]);

  const onConfirm = async () => {
    const signer = await wrappedProvider!.getSigner();

    {
      const atomicSwapManager = new ethers.Contract(
        ATOMIC_SWAP_MANAGER_ADDRESS,
        ATOMIC_SWAP_MANAGER_ABI,
        signer
      );

      console.log("debug::confirming");
      const tx = await atomicSwapManager.confirm(requestId!);
      await tx.wait();
    }

    {
      const atomicSwapManager = new ethers.Contract(
        ATOMIC_SWAP_MANAGER_ADDRESS,
        ATOMIC_SWAP_MANAGER_ABI,
        signer
      );

      const privateKey = await atomicSwapManager.revealPrivateKey(
        requestId!,
        await signer.getAddress()
      );

      console.log("debug::raw private key", privateKey);

      const hexPrivateKey = ethers.toBeHex(privateKey.toString());

      console.log("debug::hexPrivateKey", hexPrivateKey);

      const newAddress = await new ethers.Wallet(hexPrivateKey).getAddress();

      setPrivateKey(hexPrivateKey);
      setNewAccount(newAddress);
      setMode(Mode.Result);
    }
  };

  switch (mode) {
    case Mode.Input:
      return <RequestView onSubmit={onRequestSubmit} />;
    case Mode.Deposit:
      return (
        <DepositView
          title="Deposit Your Token"
          sourceChain={sourceInfo?.chain!}
          sourceChainName={sourceInfo?.chainName!}
          sourceToken={sourceInfo?.token!}
          sourceTokenAmount={sourceInfo?.tokenAmountString!}
          sourceTokenSymbol={sourceInfo?.tokenSymbol!}
          sourceAccountAddress={sourceInfo?.account!}
          onSubmit={onDepositSubmit}
        />
      );
    case Mode.WaitingFill:
      return <WaitingView title="Waiting to be filled" />;
    case Mode.Confirm:
      return (
        <ConfirmView
          sourceAddress={sourceInfo?.account!}
          sourceChain={sourceInfo?.chain!}
          sourceChainLabel={sourceInfo?.chainName!}
          sourceToken={sourceInfo?.token!}
          sourceTokenLabel={sourceInfo?.tokenSymbol!}
          sourceAmount={sourceInfo?.tokenAmountString!}
          targetAddress={fillerAddress!}
          targetChain={targetInfo?.chain!}
          targetChainLabel={targetInfo?.chainName!}
          targetToken={targetInfo?.token!}
          targetTokenLabel={targetInfo?.tokenSymbol!}
          targetAmount={targetInfo?.tokenAmountString!}
          onConfirm={onConfirm}
        />
      );
    case Mode.Result:
      return (
        <CompletionView
          chain={targetInfo?.chain!}
          chainLabel={targetInfo?.chainName!}
          address={newAccount!}
          privateKey={privateKey!}
        />
      );
    default:
      return null;
  }
};
