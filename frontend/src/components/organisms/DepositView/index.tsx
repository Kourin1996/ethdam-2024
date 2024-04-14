"use client";

import { ChainIcon } from "@/components/atoms/ChainIcon";
import { TokenIcon } from "@/components/atoms/TokenIcon";
import { ChainType } from "@/constants/chains";
import { TokenType } from "@/constants/tokens";
import { Flex, Title, Button, Text } from "@mantine/core";

type Props = {
  title: string;
  sourceChain: ChainType;
  sourceChainName: string;
  sourceToken: string;
  sourceTokenAmount: string;
  sourceTokenSymbol: string;
  sourceAccountAddress: string;

  onSubmit: () => void;
};

export const DepositView = ({
  title,
  sourceChain,
  sourceChainName,
  sourceToken,
  sourceTokenAmount,
  sourceTokenSymbol,
  sourceAccountAddress,
  onSubmit,
}: Props) => {
  return (
    <Flex direction="column">
      <Title
        mt={12}
        order={2}
        style={{ textAlign: "center", color: "#333333" }}
      >
        {title}
      </Title>

      <Flex mt={48} direction="column" align="center">
        <Flex direction="column" miw={250} gap={32}>
          <Flex direction="column">
            <Title order={4} style={{ textDecoration: "underline" }}>
              Chain
            </Title>
            <Flex mt={16} align="center" gap={12}>
              <ChainIcon chain={sourceChain} />
              <Text>{sourceChainName}</Text>
            </Flex>
          </Flex>

          <Flex direction="row" gap={48}>
            <Flex direction="column">
              <Title order={4} style={{ textDecoration: "underline" }}>
                Amount
              </Title>
              <Flex mt={16} align="center" gap={12}>
                <TokenIcon token={sourceToken as TokenType} />
                <Text>{`${sourceTokenAmount} ${sourceTokenSymbol}`}</Text>
              </Flex>
            </Flex>
          </Flex>

          <Flex direction="column">
            <Title order={4} style={{ textDecoration: "underline" }}>
              Account
            </Title>
            <Flex mt={16} align="center" gap={12}>
              <Text>{sourceAccountAddress}</Text>
            </Flex>
          </Flex>
        </Flex>

        <Button mt={36} miw={250} onClick={onSubmit}>
          Deposit
        </Button>
      </Flex>
    </Flex>
  );
};
