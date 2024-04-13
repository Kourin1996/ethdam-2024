// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {Host} from "@oasisprotocol/sapphire-contracts/contracts/OPL.sol";

interface IERC20 {
    function transferFrom(
        address from,
        address to,
        uint256 value
    ) external returns (bool);
}

contract FundManager is Host {
    constructor(
        address sapphireEventRouterAddress
    ) Host(sapphireEventRouterAddress) {}

    function deposit(
        uint256 requestId,
        address tokenAddress, // token contract address
        address tokenOwnerAddress, // payer account
        address targetAccount, // anonymous account
        uint256 tokenAmount // amount
    ) external payable {
        if (tokenAddress != address(0x0)) {
            IERC20 erc20 = IERC20(tokenAddress);

            bool succeeded = erc20.transferFrom(
                tokenOwnerAddress,
                targetAccount,
                tokenAmount
            );

            require(succeeded, "failed ERC20 transfer");
        } else {
            require(
                msg.value == tokenAmount,
                "Amount doesn't match with value"
            );
            payable(targetAccount).transfer(msg.value);
        }

        postMessage(
            "deposit",
            abi.encode(requestId, targetAccount, tokenAddress, tokenAmount)
        );
    }

    function fill(
        uint256 requestId,
        address tokenAddress, // token contract address
        address tokenOwnerAddress, // payer account
        address targetAccount, // anonymous account
        uint256 tokenAmount // amount
    ) external payable {
        if (tokenAddress != address(0x0)) {
            IERC20 erc20 = IERC20(tokenAddress);

            bool succeeded = erc20.transferFrom(
                tokenOwnerAddress,
                targetAccount,
                tokenAmount
            );

            require(succeeded, "failed ERC20 transfer");
        } else {
            require(
                msg.value == tokenAmount,
                "Amount doesn't match with value"
            );
            payable(targetAccount).transfer(msg.value);
        }

        postMessage(
            "fill",
            abi.encode(requestId, targetAccount, tokenAddress, tokenAmount)
        );
    }
}
