"use client";
import { TokenType } from "@/constants/tokens";
import Image from "next/image";
import React from "react";

const Paths: Record<TokenType, string> = {
  "1inch": "/icons/tokens/1inch.svg",
  link: "/icons/tokens/chainlink.svg",
  dai: "/icons/tokens/dai.svg",
  usdc: "/icons/tokens/usdc.svg",
  usdt: "/icons/tokens/usdt.svg",
};

export const TokenIcon = ({
  token,
  size = 32,
}: {
  token: TokenType;
  size?: number;
}) => {
  return token in Paths ? (
    <Image src={Paths[token]} alt={token} width={size} height={size} />
  ) : null;
};
