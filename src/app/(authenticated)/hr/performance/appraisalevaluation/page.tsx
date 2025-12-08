"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { MaterialTableWrapper } from "@/components/form-table/reusable-table/MaterialReactTableWrapper";
import { appraisalEvaluationSchema } from "@/lib/schemas/performance";
import { appraisalPlanSubjectSchema } from "@/lib/schemas/performance/plan-subject";

// A utility component to wrap the tab content
// This displays the content only when the tab is active
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// Function to generate accessibility props for the Tab
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
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="performance tabs"
        >
          <Tab label="Evaluations" {...a11yProps(0)} />
          <Tab label="Evaluations Per Subject" {...a11yProps(1)} />
        </Tabs>
      </Box>

      {/* First Tab Content: Evaluations */}
      <TabPanel value={value} index={0}>
        <MaterialTableWrapper schema={appraisalEvaluationSchema} />
      </TabPanel>

      {/* Second Tab Content: Evaluations Per Subject */}
      <TabPanel value={value} index={1}>
        <MaterialTableWrapper schema={appraisalPlanSubjectSchema} />
      </TabPanel>
    </Box>
  );
};
