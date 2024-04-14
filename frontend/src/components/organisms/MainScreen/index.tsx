"use client";

import { Box, Tabs } from "@mantine/core";
import { useState } from "react";
import { RequesterScreen } from "@/components/containers/RequesterScreen";
import { FillerScreen } from "@/components/containers/FillerScreen";

export const MainScreen = () => {
  const [activeTab, setActiveTab] = useState<"request" | "resolve">("request");

  const activeTabStyle = {
    color: "white",
    fontWeight: "bold",
    backgroundColor: "var(--mantine-color-blue-filled)",
    borderRadius: "15px 15px 0 0",
  };

  return (
    <Tabs
      keepMounted={false}
      value={activeTab}
      onChange={(x: string | null) =>
        setActiveTab((x as "request" | "resolve" | null) ?? "request")
      }
      style={{ width: "100%", borderWidth: 0 }}
    >
      <Tabs.List grow style={{ borderWidth: 0 }}>
        <Tabs.Tab
          value="request"
          style={{
            ...(activeTab === "request" ? activeTabStyle : {}),
            borderWidth: 0,
          }}
        >
          Request
        </Tabs.Tab>
        <Tabs.Tab
          value="resolve"
          style={{
            ...(activeTab === "resolve" ? activeTabStyle : {}),
            borderWidth: 0,
          }}
        >
          Resolve
        </Tabs.Tab>
      </Tabs.List>

      <Box
        mih={500}
        py={24}
        px={32}
        style={{
          border: "1px solid #cccccc",
          borderRadius: "0px 0px 10px 10px",
        }}
      >
        <Tabs.Panel value="request">
          <RequesterScreen />
        </Tabs.Panel>
        <Tabs.Panel value="resolve">
          <FillerScreen />
        </Tabs.Panel>
      </Box>
    </Tabs>
  );
};
