"use client";
import { useState } from "react";
import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { gradeSchema } from "@/lib/schemas/grade";
// import { organizationSchema } from "@/lib/schemas/organization-node";
import { positionSchema } from "@/lib/schemas/position";
import { shiftSchema } from "@/lib/schemas/shift";
import { Box, Tabs, Tab } from "@mui/material";
import { titleSchema } from "@/lib/schemas/title";
import { bankSchema } from "@/lib/schemas/bank";
import { bankBranchSchema } from "@/lib/schemas/bank-branch";
import { workScheduleSchema } from "@/lib/schemas/leave/settings";

function TabPanel(props: any) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </Box>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        bgcolor: "background.paper",
      }}
    >
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Positions" {...a11yProps(0)} />
          <Tab label="Grades" {...a11yProps(1)} />
          <Tab label="Work Schedule" {...a11yProps(2)} />
          <Tab label="Titles" {...a11yProps(3)} />
          <Tab label="Banks" {...a11yProps(4)} />
          <Tab label="Bank Branches" {...a11yProps(5)} />
          {/* <Tab label="Organizations" {...a11yProps(3)} /> */}
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <MaterialTableWrapper schema={positionSchema} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <MaterialTableWrapper schema={gradeSchema} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <MaterialTableWrapper schema={workScheduleSchema} />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <MaterialTableWrapper schema={titleSchema} />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <MaterialTableWrapper schema={bankSchema} />
      </TabPanel>
      <TabPanel value={value} index={5}>
        <MaterialTableWrapper schema={bankBranchSchema} />
      </TabPanel>
      {/* <TabPanel value={value} index={3}>
        <MaterialTableWrapper schema={organizationSchema} />
      </TabPanel> */}
    </Box>
  );
};
