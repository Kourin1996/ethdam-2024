"use client";
import { ChainType } from "@/constants/chains";
import Image from "next/image";
import React from "react";

const Paths: Record<ChainType, string> = {
  optimism: "/icons/chains/optimism.svg",
  arbitrum: "/icons/chains/arbitrum.svg",
};

export const ChainIcon = ({
  chain,
  size = 32,
}: {
  chain: ChainType;
  size?: number;
}) => {
  return chain in Paths ? (
    <Image src={Paths[chain]} alt={chain} width={size} height={size} />
  ) : null;
};
