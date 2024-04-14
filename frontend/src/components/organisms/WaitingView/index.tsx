"use client";

import { Flex, Title, Center, Loader } from "@mantine/core";

export const WaitingView = ({ title }: { title: string }) => {
  return (
    <Flex direction="column">
      <Title
        mt={12}
        order={2}
        style={{ textAlign: "center", color: "#333333" }}
      >
        {title}
      </Title>
      <Center mt={145}>
        <Loader size={64} />
      </Center>
    </Flex>
  );
};
