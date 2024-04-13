import {Enclave, Result, autoswitch} from "@oasisprotocol/sapphire-contracts/contracts/OPL.sol";

interface IAtomicSwapManager {
    function onDeposit(
        uint32 chainId,
        uint256 requestId,
        address sourceAccountAddress,
        address tokenAddress,
        uint256 tokenAmount
    ) external returns (bool);

    function onFill(
        uint32 chainId,
        uint256 requestId,
        address targetAccountAddress,
        address tokenAddress,
        uint256 tokenAmount
    ) external returns (bool);
}

contract SapphireEventRouter is Enclave {
    uint32 _chainId;
    address _atomicSwapManager;

    constructor(
        address otherEnd,
        bytes32 chain,
        uint32 chainId,
        address atomicSwapManager
    ) Enclave(otherEnd, autoswitch(chain)) {
        _chainId = chainId;
        _atomicSwapManager = atomicSwapManager;

        registerEndpoint("deposit", on_deposit);
        registerEndpoint("fill", on_fill);
    }

    function on_deposit(bytes calldata _args) internal returns (Result) {
        (
            uint256 requestId,
            address account,
            address tokenAddress,
            uint256 amount
        ) = abi.decode(_args, (uint256, address, address, uint256));

        IAtomicSwapManager(_atomicSwapManager).onDeposit(
            _chainId,
            requestId,
            account,
            tokenAddress,
            amount
        );

        return Result.Success;
    }

    function on_fill(bytes calldata _args) internal returns (Result) {
        (
            uint256 requestId,
            address account,
            address tokenAddress,
            uint256 amount
        ) = abi.decode(_args, (uint256, address, address, uint256));

        IAtomicSwapManager(_atomicSwapManager).onFill(
            _chainId,
            requestId,
            account,
            tokenAddress,
            amount
        );

        return Result.Success;
    }
}
