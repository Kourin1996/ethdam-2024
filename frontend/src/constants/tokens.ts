import { ChainType } from "./chains";

export type TokenType = "1inch" | "link" | "dai" | "usdc" | "usdt";

export const Tokens = [
  { value: "1inch", label: "1INCH" },
  { value: "link", label: "LINK" },
  { value: "dai", label: "DAI" },
  { value: "usdc", label: "USDC" },
  { value: "usdt", label: "USDT" },
];

export const TokenIdToSymbol = Object.fromEntries(
  Tokens.map((t) => [t.value, t.label])
);

export const OptimismTokens = [...Tokens];

export const ArbitrumTokens = [...Tokens];

export const TokensByChain = {
  optimism: OptimismTokens,
  arbitrum: ArbitrumTokens,
} as const;

export const TokenAddressByChainAndTokenId: Record<
  ChainType,
  Record<TokenType, string>
> = {
  optimism: {
    "1inch": "0x9a7068673fcC204a1B456f6A3fD92512729491b1",
    link: "0xDa711213bdd15dafd0DFAF8F65864fD93E4dCB61",
    dai: "0x6Ea1942BD29CE4Fad56A6d01969e6fe89Ba725ba",
    usdc: "0xa30eA3F79Fb608cf90D617Ca8F00A6CB2A0C928e",
    usdt: "0x6BAd482b7898e9aA4a0a6F78C04477b2c6949984",
  },
  arbitrum: {
    "1inch": "0x85B1188879F9ae6FddeADc3b514Fa30A95d6fB7E",
    link: "0x027CdE649084f09DB9EB88AAbBC990444832bd2d",
    dai: "0x44F8bcb1876aFc6406E27141373b7bf2d36b017f",
    usdc: "0xA104B9b8A02499d03bD81a885677d17a3D7cA799",
    usdt: "0x6C8Da5ceDcEF1cb9b62d4F590F8E69f7746cF692",
  },
};

export const TokenIdByChainAndTokenAddress: Record<
  ChainType,
  Record<string, TokenType>
> = {
  optimism: {
    "0x9a7068673fcC204a1B456f6A3fD92512729491b1": "1inch",
    "0xDa711213bdd15dafd0DFAF8F65864fD93E4dCB61": "link",
    "0x6Ea1942BD29CE4Fad56A6d01969e6fe89Ba725ba": "dai",
    "0xa30eA3F79Fb608cf90D617Ca8F00A6CB2A0C928e": "usdc",
    "0x6BAd482b7898e9aA4a0a6F78C04477b2c6949984": "usdt",
  },
  arbitrum: {
    "0x85B1188879F9ae6FddeADc3b514Fa30A95d6fB7E": "1inch",
    "0x027CdE649084f09DB9EB88AAbBC990444832bd2d": "link",
    "0x44F8bcb1876aFc6406E27141373b7bf2d36b017f": "dai",
    "0xA104B9b8A02499d03bD81a885677d17a3D7cA799": "usdc",
    "0x6C8Da5ceDcEF1cb9b62d4F590F8E69f7746cF692": "usdt",
  },
};
