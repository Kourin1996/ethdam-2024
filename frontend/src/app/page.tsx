import { MainScreen } from "@/components/organisms/MainScreen";
import { Box, Container, Flex } from "@mantine/core";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Home() {
  return (
    <main>
      <Flex miw="100%" pt={12} px={12}>
        <Flex w="100%" direction="column">
          <Flex justify="end">
            <ConnectButton />
          </Flex>
          <Flex w="100%" justify="center" mt={48}>
            <Box miw={900} maw={1200}>
              <MainScreen />
            </Box>
          </Flex>
        </Flex>
      </Flex>
    </main>
  );
}
