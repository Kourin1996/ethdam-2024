"use client";

import { ChainIcon } from "@/components/atoms/ChainIcon";
import { TokenIcon } from "@/components/atoms/TokenIcon";
import { ChainType, Chains } from "@/constants/chains";
import { TokenType, TokensByChain } from "@/constants/tokens";
import {
  Flex,
  Select,
  Title,
  SelectProps,
  Group,
  Box,
  Center,
  rem,
  NumberInput,
  Button,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { IconArrowsExchange } from "@tabler/icons-react";
import { useChainId, useSwitchChain } from "wagmi";
import { sapphireTestnet } from "viem/chains";

const chainRenderSelectOption: SelectProps["renderOption"] = ({ option }) => (
  <Group flex="1" gap="xs">
    <ChainIcon chain={option.value as ChainType} size={32} />
    {option.label}
  </Group>
);

const tokenRenderSelectOption: SelectProps["renderOption"] = ({ option }) => (
  <Group flex="1" gap="xs">
    <TokenIcon token={option.value as TokenType} size={32} />
    {option.label}
  </Group>
);

type Props = {
  onSubmit: (
    sourceChain: string,
    sourceToken: string,
    sourceAmount: string,
    targetChain: string,
    targetToken: string,
    targetAmount: string
  ) => void;
};

export const RequestView = ({ onSubmit }: Props) => {
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  useEffect(() => {
    if (chainId !== sapphireTestnet.id) {
      return switchChain({ chainId: sapphireTestnet.id });
    }
  }, [chainId, switchChain]);

  const [sourceChain, setSourceChain] = useState<string | null>(null);
  const [sourceToken, setSourceToken] = useState<string | null>(null);
  const [sourceAmount, setSourceAmount] = useState<string | undefined>(
    undefined
  );
  const [targetChain, setTargetChain] = useState<string | null>(null);
  const [targetToken, setTargetToken] = useState<string | null>(null);
  const [targetAmount, setTargetAmount] = useState<string | undefined>(
    undefined
  );

  const disabledButton =
    sourceChain === null ||
    sourceToken === null ||
    sourceAmount === undefined ||
    Number.isNaN(Number.parseFloat(sourceAmount)) ||
    targetChain === null ||
    targetToken === null ||
    targetAmount === undefined ||
    Number.isNaN(Number.parseFloat(targetAmount));

  const onClick = () => {
    onSubmit(
      sourceChain!,
      sourceToken!,
      sourceAmount!,
      targetChain!,
      targetToken!,
      targetAmount!
    );
  };

  return (
    <Flex direction="column">
      <Title
        mt={12}
        order={2}
        style={{ textAlign: "center", color: "#333333" }}
      >
        Create swap request
      </Title>

      <Flex mt={48} direction="column" align="center">
        <Flex direction="column">
          <Flex direction="row" gap={60} align="center">
            {/* source */}
            <Flex direction="column" maw={300} gap={24}>
              <Title
                order={4}
                style={{ color: "#333333", textDecoration: "underline" }}
              >
                Send
              </Title>

              <Box>
                <Select
                  label="Chain"
                  placeholder="Select chain"
                  data={Chains}
                  leftSection={
                    <Center px={8} style={{ width: rem(16), height: rem(16) }}>
                      <ChainIcon chain={sourceChain as ChainType} size={24} />
                    </Center>
                  }
                  renderOption={chainRenderSelectOption}
                  value={sourceChain}
                  onChange={(e) => {
                    setSourceChain(e as string | null);
                    setSourceToken(null);
                  }}
                />
              </Box>
              <Box>
                <Select
                  label="Token"
                  placeholder="Select token"
                  disabled={
                    sourceChain === null || !(sourceChain in TokensByChain)
                  }
                  data={
                    sourceChain !== null && sourceChain in TokensByChain
                      ? TokensByChain[sourceChain as "optimism" | "arbitrum"] ??
                        []
                      : []
                  }
                  leftSection={
                    <Center px={8} style={{ width: rem(16), height: rem(16) }}>
                      <TokenIcon token={sourceToken as TokenType} size={24} />
                    </Center>
                  }
                  renderOption={tokenRenderSelectOption}
                  value={sourceToken}
                  onChange={(e) => setSourceToken(e as string | null)}
                />
              </Box>
              <Box>
                <NumberInput
                  label="Amount"
                  placeholder="Input amount"
                  min={0}
                  value={sourceAmount}
                  onChange={(e) => setSourceAmount(e.toString())}
                />
              </Box>
            </Flex>
            {/* swap icon */}
            <Box mt={72}>
              <IconArrowsExchange size={64} strokeWidth={2} color={"#228be6"} />
            </Box>

            {/* target */}
            <Flex direction="column" maw={300} gap={24}>
              <Title
                order={4}
                style={{ color: "#333333", textDecoration: "underline" }}
              >
                Receive
              </Title>

              <Box>
                <Select
                  label="Chain"
                  placeholder="Select chain"
                  data={Chains}
                  leftSection={
                    <Center px={8} style={{ width: rem(16), height: rem(16) }}>
                      <ChainIcon chain={targetChain as ChainType} size={24} />
                    </Center>
                  }
                  renderOption={chainRenderSelectOption}
                  value={targetChain}
                  onChange={(e) => {
                    setTargetChain(e as string | null);
                    setTargetToken(null);
                  }}
                />
              </Box>
              <Box>
                <Select
                  label="Token"
                  placeholder="Select token"
                  disabled={
                    targetChain === null || !(targetChain in TokensByChain)
                  }
                  data={
                    targetChain !== null && targetChain in TokensByChain
                      ? TokensByChain[targetChain as "optimism" | "arbitrum"] ??
                        []
                      : []
                  }
                  leftSection={
                    <Center px={8} style={{ width: rem(16), height: rem(16) }}>
                      <TokenIcon token={targetToken as TokenType} size={24} />
                    </Center>
                  }
                  renderOption={tokenRenderSelectOption}
                  value={targetToken}
                  onChange={(e) => setTargetToken(e as string | null)}
                />
              </Box>
              <Box>
                <NumberInput
                  label="Amount"
                  placeholder="Input amount"
                  min={0}
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.toString())}
                />
              </Box>
            </Flex>
          </Flex>

          <Flex mt={48} w="100%" justify="center">
            <Button miw={250} disabled={disabledButton} onClick={onClick}>
              Request
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
