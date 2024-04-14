"use client";

import { ChainIcon } from "@/components/atoms/ChainIcon";
import { TokenIcon } from "@/components/atoms/TokenIcon";
import { ChainType } from "@/constants/chains";
import { TokenIdToSymbol, TokenType } from "@/constants/tokens";
import { Flex, Title, Table, Text, Button } from "@mantine/core";
import { ethers } from "ethers";

type Request = {
  readonly requestId: number;
  readonly sourceChainId: number;
  readonly sourceChain: string;
  readonly sourceChainName: string;
  readonly sourceTokenId: string;
  readonly sourceTokenAddress: string;
  readonly sourceTokenAmount: BigInt;
  readonly targetChainId: number;
  readonly targetChain: string;
  readonly targetChainName: string;
  readonly targetTokenId: string;
  readonly targetTokenAddress: string;
  readonly targetTokenAmount: BigInt;
  readonly deposited: boolean;
  readonly filled: boolean;
  readonly confirmed: boolean;
};

type Props = {
  requests: Request[];
  onSelectRequest: (req: Request) => void;
};

export const RequestListView = ({ requests, onSelectRequest }: Props) => {
  return (
    <Flex direction="column">
      <Title
        mt={12}
        order={2}
        style={{ textAlign: "center", color: "#333333" }}
      >
        Request List
      </Title>

      <Flex mt={48} direction="column" align="center">
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Source</Table.Th>
              <Table.Th></Table.Th>
              <Table.Th>Target</Table.Th>
              <Table.Th></Table.Th>
              <Table.Th></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {requests.map((r) => {
              return (
                <Table.Tr key={r.requestId}>
                  {/* source */}
                  <Table.Td>
                    <Flex align="center" gap={8}>
                      <ChainIcon chain={r.sourceChain as ChainType} size={28} />
                      <Text>{r.sourceChainName}</Text>
                    </Flex>
                  </Table.Td>
                  <Table.Td>
                    <Flex align="center" gap={8}>
                      <TokenIcon
                        token={r.sourceTokenId as TokenType}
                        size={28}
                      />
                      <Text>{`${ethers.formatEther(
                        r.sourceTokenAmount.toString()
                      )} ${TokenIdToSymbol[r.sourceTokenId]}`}</Text>
                    </Flex>
                  </Table.Td>
                  {/* target */}
                  <Table.Td>
                    <Flex align="center" gap={8}>
                      <ChainIcon chain={r.targetChain as ChainType} size={28} />
                      <Text>{r.targetChainName}</Text>
                    </Flex>
                  </Table.Td>
                  <Table.Td>
                    <Flex align="center" gap={8}>
                      <TokenIcon
                        token={r.targetTokenId as TokenType}
                        size={28}
                      />
                      <Text>{`${ethers.formatEther(
                        r.targetTokenAmount.toString()
                      )} ${TokenIdToSymbol[r.targetTokenId]}`}</Text>
                    </Flex>
                  </Table.Td>
                  <Table.Td>
                    <Button w="100px" onClick={() => onSelectRequest(r)}>
                      Resolve
                    </Button>
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </Flex>
    </Flex>
  );
};
