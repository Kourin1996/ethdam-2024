"use client";

import { ChainIcon } from "@/components/atoms/ChainIcon";
import { ChainType } from "@/constants/chains";
import { Flex, Title, Box, Text, Tooltip } from "@mantine/core";

type Props = {
  chain: string;
  chainLabel: string;
  address: string;
  privateKey: string;
};

export const CompletionView = ({
  chain,
  chainLabel,
  address,
  privateKey,
}: Props) => {
  const onClickAddress = () => {
    if (chain === "optimism") {
      window.open(
        `https://sepolia-optimism.etherscan.io/address/${address}`,
        "_blank"
      );
    } else {
      window.open(`https://sepolia.arbiscan.io/address/${address}`, "_blank");
    }
  };

  const onClickPrivateKey = () => {
    navigator.clipboard.writeText(privateKey);
  };

  return (
    <Flex direction="column">
      <Title
        mt={12}
        order={2}
        style={{ textAlign: "center", color: "#333333" }}
      >
        {`Congratulation!!`}
      </Title>
      <Title mt={6} order={2} style={{ textAlign: "center", color: "#333333" }}>
        {`You've received account successfully 🎉`}
      </Title>
      <Flex direction="column" mt={64} align="center" gap={24}>
        <Flex direction="column" w={500}>
          <Title order={4}>Chain</Title>
          <Flex mt={16} align="center" gap={12}>
            <ChainIcon chain={chain as ChainType} />
            <Text>{chainLabel}</Text>
          </Flex>
        </Flex>

        <Flex direction="column" w={500}>
          <Title order={4} style={{ textDecoration: "underline" }}>
            Address
          </Title>
          <Tooltip label="Open explorer" onClick={onClickAddress}>
            <Box
              mt={8}
              style={{
                padding: "16px",
                cursor: "pointer",
                border: "1px solid #aaaaaa",
                borderRadius: "8px",
              }}
            >
              <Text style={{ textAlign: "center" }}>{address}</Text>
            </Box>
          </Tooltip>
        </Flex>

        <Flex direction="column" w={500}>
          <Title order={4} style={{ textDecoration: "underline" }}>
            Private key
          </Title>
          <Tooltip label={"Click for copy"} onClick={onClickPrivateKey}>
            <Box
              mt={8}
              style={{
                border: "1px solid #aaaaaa",
                borderRadius: "8px",
                padding: "16px",
                cursor: "pointer",
              }}
            >
              <Text
                style={{
                  filter: "blur(4px)",
                  maxWidth: "450px",
                  overflow: "hidden",
                }}
              >
                {privateKey}
              </Text>
            </Box>
          </Tooltip>
        </Flex>
      </Flex>
    </Flex>
  );
};
