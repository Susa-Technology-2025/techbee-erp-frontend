"use client";

import { navItems } from "@/components/nav-items/nav-links-index";
import { Paper, Button } from "@mui/material";

function transformPermissions(data) {
  return data.map((d) => ({
    action: "page_view",
    code: d.link,
    description: d.description ?? "",
    frontendEndpoint: d.link,
    hub: d.hub,
    moduleField: d.module ?? "",
    entity: d.entity ?? "",
    isActive: d.active ?? false,
    method: "GET",
    name: d.name,
  }));
}

export default () => {
  const newArray = transformPermissions(navItems);

  const download = () => {
    const blob = new Blob([JSON.stringify(newArray, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "permissions.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Paper component="div" sx={{ height: "80vh", overflow: "auto" }}>
      <Button onClick={download}>Download Permissions As JSON</Button>
      <pre>{JSON.stringify(newArray, null, 2)}</pre>
    </Paper>
  );
};
