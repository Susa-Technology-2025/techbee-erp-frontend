import {MilestoneDeadlineUpcomingLeadHoursField} from "./NotificationLeadsSectionFields"
import {ProjectDeadlineUpcomingLeadHoursField} from "./NotificationLeadsSectionFields"
import {TaskDeadlineUpcomingLeadHoursField} from "./NotificationLeadsSectionFields"
import { Box } from "@mui/material";


export const NotificationLeadsSection = () =>{
    return ( <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "end",
        justifyContent: "start",
      }}
    >
      <MilestoneDeadlineUpcomingLeadHoursField/>
<ProjectDeadlineUpcomingLeadHoursField/>
<TaskDeadlineUpcomingLeadHoursField/>
      </Box>)
    }