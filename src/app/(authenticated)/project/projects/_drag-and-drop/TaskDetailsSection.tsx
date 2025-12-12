import React, { useState } from "react";
import { Box, Tab } from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import { Task } from "./types";

import WbsActivity from "../../activities/page";
import ActualsLedger from "../../actualsLedgers/page";
import ChangeRequest from "../../changeRequests/page";
import Performance from "../../performanceRecords/page";
import WbsDependencyTo from "../../wbsDependencies/page";
import WbsDependencyFrom from "../../wbsDependencies/page";
import WbsComment from "../../comments/page";
import WbsChildren from "../../wbsItems/page";
import WbsAttachment from "../../attachments/page";
import WbsAssignment from "../../wbsAssignments/page";
import TimeEntryCreateInputForm from "../../timeEntries/page";

type TaskDetailSectionProps = {
  task: Task;
};

export function TaskDetailSection({ task }: TaskDetailSectionProps) {
  const tabs = [
    {
      label: "Sub Tasks",
      component: (
        <WbsChildren
          idString={"?where[parent][id]=" + task.id}
          defaultValues={{
            wbsItem: { id: task.id },
          }}
        />
      ),
    },
    {
      label: "Attachments",
      component: (
        <WbsAttachment
          idString={"?where[wbsItem][id]=" + task.id}
          defaultValues={{
            wbsItem: { id: task.id },
          }}
        />
      ),
    },
    {
      label: "WBS Activity",
      component: (
        <WbsActivity
          idString={"?where[wbsItem][id]=" + task.id}
          defaultValues={{
            wbsItem: { id: task.id },
          }}
        />
      ),
    },
    {
      label: "Actuals Ledger",
      component: (
        <ActualsLedger
          idString={"?where[wbsItem][id]=" + task.id}
          defaultValues={{
            wbsItem: { id: task.id },
          }}
        />
      ),
    },
    {
      label: "Change Requests",
      component: (
        <ChangeRequest
          idString={"?where[wbsItem][id]=" + task.id}
          defaultValues={{
            wbsItem: { id: task.id },
          }}
        />
      ),
    },
    {
      label: "Performance Records",
      component: (
        <Performance
          idString={"?where[wbsItem][id]=" + task.id}
          defaultValues={{
            wbsItem: { id: task.id },
          }}
        />
      ),
    },
    {
      label: "WBS Assignments",
      component: (
        <WbsAssignment
          idString={"?where[wbsItem][id]=" + task.id}
          defaultValues={{
            wbsItem: { id: task.id },
          }}
        />
      ),
    },
    {
      label: "TimeEntries",
      component: (
        <TimeEntryCreateInputForm
          idString={"?where[wbsItem][id]=" + task.id}
          defaultValues={{
            wbsItem: { id: task.id },
          }}
        />
      ),
    },
    {
      label: "Dependencies To",
      component: (
        <WbsDependencyTo
          idString={"?where[fromField][id]=" + task.id}
          defaultValues={{
            fromField: { id: task.id },
          }}
        />
      ),
    },
    {
      label: "Dependencies From",
      component: (
        <WbsDependencyFrom
          idString={"?where[to][id]=" + task.id}
          defaultValues={{
            to: { id: task.id },
          }}
        />
      ),
    },
    {
      label: "Comments",
      component: (
        <WbsComment
          idString={"?where[wbsItem][id]=" + task.id}
          defaultValues={{
            wbsItem: { id: task.id },
          }}
        />
      ),
    },
  ];
  const [tab, setTab] = useState(tabs[0].label);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };

  return (
    <TabContext value={tab}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <TabList
          onChange={handleTabChange}
          variant="scrollable"
          sx={{
            minHeight: 48,
            "& .MuiTab-root": {
              minHeight: 48,
              fontSize: "0.875rem",
              fontWeight: 500,
              textTransform: "none",
              py: 1,
              px: 2,
              minWidth: "auto",
              mr: 1,
            },
          }}
        >
          {tabs.map((t) => (
            <Tab key={t.label} label={t.label} value={t.label} />
          ))}
        </TabList>
      </Box>

      <Box
        sx={{
          height: "50vh",
          overflow: "auto",
          scrollbarWidth: "thin",
        }}
      >
        {tabs.map((t) => (
          <TabPanel key={t.label} value={t.label} sx={{ p: 0 }}>
            {t.component}
          </TabPanel>
        ))}
      </Box>
    </TabContext>
  );
}
