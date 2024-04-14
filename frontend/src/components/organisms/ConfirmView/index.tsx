"use client";

import { ChainIcon } from "@/components/atoms/ChainIcon";
import { TokenIcon } from "@/components/atoms/TokenIcon";
import { ChainType } from "@/constants/chains";
import { TokenType } from "@/constants/tokens";
import { Flex, Title, Box, Button, Text } from "@mantine/core";
import { IconArrowsExchange } from "@tabler/icons-react";

type Props = {
  sourceAddress: string;
  sourceChain: string;
  sourceChainLabel: string;
  sourceToken: string;
  sourceTokenLabel: string;
  sourceAmount: string;
  //
  targetAddress: string;
  targetChain: string;
  targetChainLabel: string;
  targetToken: string;
  targetTokenLabel: string;
  targetAmount: string;
  //
  onConfirm: () => void;
};

export const ConfirmView = ({
  sourceAddress,
  sourceChain,
  sourceChainLabel,
  sourceToken,
  sourceTokenLabel,
  sourceAmount,
  targetAddress,
  targetChain,
  targetChainLabel,
  targetToken,
  targetTokenLabel,
  targetAmount,
  onConfirm,
}: Props) => {
  return (
    <Flex direction="column">
      <Title
        mt={12}
        order={2}
        style={{ textAlign: "center", color: "#333333" }}
      >
        Confirm swap
      </Title>

      <Flex mt={48} direction="column" align="center">
        <Flex w="100%" direction="column" align="center">
          <Flex
            w="100%"
            direction="row"
            gap={60}
            align="center"
            justify="space-between"
          >
            {/* source */}
            <Flex direction="column" gap={24}>
              <Title
                order={4}
                style={{ color: "#333333", textDecoration: "underline" }}
              >
                Send
              </Title>
              <Flex direction="column">
                <Title order={4}>Chain</Title>
                <Flex mt={16} align="center" gap={12}>
                  <ChainIcon chain={sourceChain as ChainType} />
                  <Text>{sourceChainLabel}</Text>
                </Flex>
              </Flex>

              <Flex direction="row" gap={48}>
                <Flex direction="column">
                  <Title order={4}>Amount</Title>
                  <Flex mt={16} align="center" gap={12}>
                    <TokenIcon token={sourceToken as TokenType} />
                    <Text>{`${sourceAmount} ${sourceTokenLabel}`}</Text>
                  </Flex>
                </Flex>
              </Flex>

              <Flex direction="row" gap={48}>
                <Flex direction="column">
                  <Title order={4}>Address</Title>
                  <Flex mt={16} align="center" gap={12}>
                    <Text
                      style={{ textDecoration: "underline", cursor: "pointer" }}
                      onClick={() => {
                        navigator.clipboard.writeText(sourceAddress);
                      }}
                    >
                      {sourceAddress}
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>

            {/* swap icon */}
            <Box mt={72}>
              <IconArrowsExchange size={64} strokeWidth={2} color={"#228be6"} />
            </Box>

            {/* target */}
            <Flex direction="column" gap={24}>
              <Title
                order={4}
                style={{ color: "#333333", textDecoration: "underline" }}
              >
                Receive
              </Title>
              <Flex direction="column">
                <Title order={4}>Chain</Title>
                <Flex mt={16} align="center" gap={12}>
                  <ChainIcon chain={targetChain as ChainType} />
                  <Text>{targetChainLabel}</Text>
                </Flex>
              </Flex>

              <Flex direction="row" gap={48}>
                <Flex direction="column">
                  <Title order={4}>Amount</Title>
                  <Flex mt={16} align="center" gap={12}>
                    <TokenIcon token={targetToken as TokenType} />
                    <Text>{`${targetAmount} ${targetTokenLabel}`}</Text>
                  </Flex>
                </Flex>
              </Flex>

              <Flex direction="row" gap={48}>
                <Flex direction="column">
                  <Title order={4}>Address</Title>
                  <Flex mt={16} align="center" gap={12}>
                    <Text
                      style={{ textDecoration: "underline", cursor: "pointer" }}
                      onClick={() => {
                        navigator.clipboard.writeText(targetAddress);
                      }}
                    >
                      {targetAddress}
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          </Flex>

          <Flex mt={48} w="100%" justify="center">
            <Button miw={250} onClick={onConfirm}>
              Confirm
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
