// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./lib/EllipticCurve.sol";

contract AtomicSwapManager {
    // secp256k1 parameters
    uint256 public constant GX =
        0x79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798;
    uint256 public constant GY =
        0x483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8;
    uint256 public constant AA = 0;
    uint256 public constant BB = 7;
    uint256 public constant PP =
        0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F;

    // public states
    struct Request {
        bool created;
        uint32 sourceChainId;
        address sourceTokenAddress;
        uint256 sourceTokenAmount;
        uint32 targetChainId;
        address targetTokenAddress;
        uint256 targetTokenAmount;
        //
        bool deposited;
        bool filled;
        uint256 sourcePrivateKeyIndex;
        uint256 targetPrivateKeyIndex;
    }

    uint256 public _numRequest = 0;
    mapping(uint256 => Request) public _requests;

    // private states
    mapping(uint256 => address) private _requesters; // request ID -> msg.sender
    mapping(uint256 => address) private _fillers; // request ID -> msg.sender

    uint256 private _privateKeySeed;
    uint256 private _privateKeyNonce = 0;

    uint256 private _numPrivateKey = 0;
    mapping(uint256 => uint256) private _privateKeys;
    mapping(uint256 => address) private _privateKeyIndexToAddress;
    mapping(address => uint256) private _addressToPrivateKeyIndex;
    mapping(uint256 => mapping(address => uint256))
        private _privateKeyIndexByRequestIdAndAccount;
    mapping(uint256 => address) private _privateKeyIndexToCreatorAddress;

    event RequestCreated(
        uint256 requestId,
        uint32 sourceChainId,
        address sourceTokenAddress,
        uint256 sourceTokenAmount,
        address sourceAccount,
        uint32 targetChainId,
        address targetTokenAddress,
        uint256 targetTokenAmount,
        uint256 privateKey
    );

    event FillerPrivateKeyCreated(
        uint256 requestId,
        address sender,
        address fillerAddress,
        uint256 fillerPrivateKey
    );

    constructor(uint256 seed) {
        _privateKeySeed = seed;
    }

    function revealPrivateKey(uint256 requestId) public view returns (uint256) {
        Request memory request = _requests[requestId];

        require(request.created, "Request doesn't exist");
        require(request.deposited, "Request is not deposited yet");
        require(request.filled, "Request is not filled yet");

        if (_requesters[requestId] == msg.sender) {
            return _privateKeys[request.targetPrivateKeyIndex];
        }
        if (_fillers[requestId] == msg.sender) {
            return _privateKeys[request.sourcePrivateKeyIndex];
        }

        revert("No keys");
    }

    // create new intent request
    function createNewRequest(
        uint32 sourceChainId,
        address sourceTokenAddress,
        uint256 sourceTokenAmount,
        uint32 targetChainId,
        address targetTokenAddress,
        uint256 targetTokenAmount
    ) external {
        require(sourceTokenAmount != 0, "source amount is zero");
        require(targetTokenAmount != 0, "target amount is zero");

        uint256 requestId = _numRequest;
        _numRequest += 1;

        uint256 sourcePrivateKeyIndex = _numPrivateKey;
        _numPrivateKey += 1;

        uint256 sourcePrivateKey = _createNewPrivateKey(msg.sender);
        (uint256 sourcePubkeyX, uint256 sourcePubkeyY) = privateKeyToPublicKey(
            sourcePrivateKey
        );
        address sourceAccountAddress = publicKeyToAddress(
            sourcePubkeyX,
            sourcePubkeyY
        );

        _privateKeys[sourcePrivateKeyIndex] = sourcePrivateKey;
        _privateKeyIndexToAddress[sourcePrivateKeyIndex] = sourceAccountAddress;
        _privateKeyIndexToCreatorAddress[sourcePrivateKeyIndex] = msg.sender;
        _addressToPrivateKeyIndex[sourceAccountAddress] = sourcePrivateKeyIndex;
        _privateKeyIndexByRequestIdAndAccount[requestId][
            msg.sender
        ] = sourcePrivateKeyIndex;

        _requests[requestId] = Request({
            created: true,
            sourceChainId: sourceChainId,
            sourceTokenAddress: sourceTokenAddress,
            sourceTokenAmount: sourceTokenAmount,
            targetChainId: targetChainId,
            targetTokenAddress: targetTokenAddress,
            targetTokenAmount: targetTokenAmount,
            //
            deposited: false,
            filled: false,
            sourcePrivateKeyIndex: sourcePrivateKeyIndex,
            targetPrivateKeyIndex: 0
        });
        _requesters[requestId] = msg.sender;

        emit RequestCreated(
            requestId,
            sourceChainId,
            sourceTokenAddress,
            sourceTokenAmount,
            sourceAccountAddress,
            targetChainId,
            targetTokenAddress,
            targetTokenAmount,
            sourcePrivateKey // TODO: remove
        );
    }

    // create new private key for filler
    function createNewFillerPrivateKey(
        uint256 requestId
    ) external returns (address) {
        uint256 privateKeyIndex = _numPrivateKey;
        _numPrivateKey += 1;

        uint256 privateKey = _createNewPrivateKey(msg.sender);
        (uint256 pubKeyX, uint256 pubKeyY) = privateKeyToPublicKey(privateKey);
        address fillerAddress = publicKeyToAddress(pubKeyX, pubKeyY);

        _privateKeys[privateKeyIndex] = privateKey;
        _privateKeyIndexToAddress[privateKeyIndex] = fillerAddress;
        _addressToPrivateKeyIndex[fillerAddress] = privateKeyIndex;
        _privateKeyIndexToCreatorAddress[privateKeyIndex] = msg.sender;
        _privateKeyIndexByRequestIdAndAccount[requestId][
            msg.sender
        ] = privateKeyIndex;

        emit FillerPrivateKeyCreated(
            requestId,
            msg.sender,
            fillerAddress,
            privateKey
        );

        return fillerAddress;
    }

    function onDeposit(
        uint32 chainId,
        uint256 requestId,
        address sourceAccountAddress, // source account address
        address tokenAddress,
        uint256 tokenAmount
    ) external returns (bool) {
        Request storage request = _requests[requestId];

        require(request.created, "Request doesn't exist");
        require(
            request.sourceChainId == chainId,
            "Source chain ID doesn't match"
        );
        require(
            _privateKeyIndexToAddress[request.sourcePrivateKeyIndex] ==
                sourceAccountAddress,
            "Account address doesn't match"
        );
        require(
            request.sourceTokenAddress == tokenAddress,
            "Token address doesn't match"
        );
        require(
            request.sourceTokenAmount == tokenAmount,
            "Token amount doesn't match"
        );

        request.deposited = true;

        return true;
    }

    function onFill(
        uint32 chainId,
        uint256 requestId,
        address targetAccountAddress, // target account address
        address tokenAddress,
        uint256 tokenAmount
    ) external returns (bool) {
        Request storage request = _requests[requestId];

        require(request.created, "Request doesn't exist");
        require(
            request.targetChainId == chainId,
            "Target chain ID doesn't match"
        );
        require(
            request.targetTokenAddress == tokenAddress,
            "Token address doesn't match"
        );
        require(
            request.targetTokenAmount == tokenAmount,
            "Token amount doesn't match"
        );

        request.filled = true;
        request.targetPrivateKeyIndex = _addressToPrivateKeyIndex[
            targetAccountAddress
        ];
        _fillers[requestId] = _privateKeyIndexToCreatorAddress[
            request.targetPrivateKeyIndex
        ];

        return true;
    }

    function _createNewPrivateKey(address creator) internal returns (uint256) {
        uint256 privateKey = uint256(
            keccak256(
                abi.encodePacked(_privateKeySeed, _privateKeyNonce, creator)
            )
        );
        _privateKeySeed = uint256(
            keccak256(abi.encodePacked(_privateKeySeed, _privateKeyNonce))
        );
        _privateKeyNonce += 1;

        return privateKey;
    }

    function privateKeyToPublicKey(
        uint256 privateKey
    ) internal pure returns (uint256, uint256) {
        return EllipticCurve.ecMul(privateKey, GX, GY, AA, PP);
    }

    function publicKeyToAddress(
        uint256 x,
        uint256 y
    ) internal pure returns (address) {
        bytes memory publicKey = abi.encodePacked(x, y);
        bytes32 keyHash = keccak256(publicKey);
        return address(uint160(uint256(keyHash)));
    }
}
