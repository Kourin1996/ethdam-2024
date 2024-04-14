"use client";

import React from "react";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import {
  sapphireTestnet,
  optimismSepolia,
  arbitrumSepolia,
} from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const config = getDefaultConfig({
  appName: "Mole Swap",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
  chains: [sapphireTestnet, optimismSepolia, arbitrumSepolia],
  ssr: true,
});

const queryClient = new QueryClient();

export const Provider = ({ children }: { children: React.ReactNode }) => (
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider>{children}</RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
);
