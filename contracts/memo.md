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

npx hardhat run scripts/02_check_new_contract_address.ts --network sapphire_testnet

npx hardhat run scripts/03_deploy_fund_manager_bsc.ts --network bsc_testnet

npx hardhat run scripts/04_deploy_sapphire_event_router_bsc.ts --network sapphire_testnet

npx hardhat run scripts/02_check_new_contract_address.ts --network sapphire_testnet

npx hardhat run scripts/05_deploy_fund_manager_avalanche.ts --network avalanche_c_testnet

npx hardhat run scripts/06_deploy_sapphire_event_router_avalanche.ts --network sapphire_testnet

# Contracts

## Sapphire

AtomicSwapManager: 0xaB3622E1278447666aFBE815576e3eCe4EA9FB4d

EventRouter for BSC: 0x789d7FF69260aa7486510CFc2946c13adAE4b0CC

EventRouter for Avalanche: 0x28a8c492Ebd9123a91Cbc03Ae9c54403Ee109CE0

## BSC

FundManager: 0x509FBe9a01aC050dc22aA73E3c8A71cA22bbed72

## Avalanche

FundManager: 0x509FBe9a01aC050dc22aA73E3c8A71cA22bbed72
