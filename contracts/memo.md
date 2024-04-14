# Deploy 手順

1. 01_deploy_atomic_swap_manager.ts を Sapphire にデプロイ

2. Sapphire の次のコントラクトアドレスを取得
3. 03_deploy_fund_manager_optimism.ts を chain1(BSC) にデプロイ
4. 04_deploy_sapphire_event_router.ts を Sapphire にデプロイ

5. Sapphire の次のコントラクトアドレスを取得
6. 05_deploy_fund_manager_arbitrum.ts を chain1(Arbitrum) にデプロイ
7. 06_deploy_sapphire_event_router を Sapphire にデプロイ

# Scripts

npx hardhat run scripts/01_deploy_atomic_swap_manager.ts --network sapphire_testnet

npx hardhat run scripts/02_deploy_fund_manager.ts --network optimism_testnet

npx hardhat run scripts/02_deploy_fund_manager.ts --network arbitrum_testnet

npx hardhat run scripts/03_deploy_erc20s.ts --network optimism_testnet

npx hardhat run scripts/03_deploy_erc20s.ts --network arbitrum_testnet

# Contracts

## Sapphire

AtomicSwapManager: 0xcC97Df2A915a12Fb844fdCd0aA5BB463bF0085BB

## Optimism

FundManager: 0x3E3610db8434d8390154FA32052E64f7C20b82aA

1INCH: 0x9a7068673fcC204a1B456f6A3fD92512729491b1
LINK: 0xDa711213bdd15dafd0DFAF8F65864fD93E4dCB61
DAI: 0x6Ea1942BD29CE4Fad56A6d01969e6fe89Ba725ba
USDC: 0xa30eA3F79Fb608cf90D617Ca8F00A6CB2A0C928e
USDT: 0x6BAd482b7898e9aA4a0a6F78C04477b2c6949984

## Arbitrum

FundManager: 0x431117919fbaFEDa10230c2bA3Bd2866C61aD5BE

1INCH: 0x85B1188879F9ae6FddeADc3b514Fa30A95d6fB7E
LINK: 0x027CdE649084f09DB9EB88AAbBC990444832bd2d
DAI: 0x44F8bcb1876aFc6406E27141373b7bf2d36b017f
USDC: 0xA104B9b8A02499d03bD81a885677d17a3D7cA799
USDT: 0x6C8Da5ceDcEF1cb9b62d4F590F8E69f7746cF692
