import {NotifyBudgetExceededField} from "./NotificationsSectionFields"
import {NotifyChangeRequestSubmittedField} from "./NotificationsSectionFields"
import {NotifyMilestoneDeadlineUpcomingField} from "./NotificationsSectionFields"
import {NotifyMilestoneOverdueField} from "./NotificationsSectionFields"
import {NotifyProjectDeadlineUpcomingField} from "./NotificationsSectionFields"
import {NotifyTaskDeadlineUpcomingField} from "./NotificationsSectionFields"
import {NotifyTaskDueSoonField} from "./NotificationsSectionFields"
import {NotifyTaskOverdueField} from "./NotificationsSectionFields"
import { Box } from "@mui/material";


export const NotificationsSection = () =>{
    return ( <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "end",
        justifyContent: "start",
      }}
    >
      <NotifyBudgetExceededField/>
<NotifyChangeRequestSubmittedField/>
<NotifyMilestoneDeadlineUpcomingField/>
<NotifyMilestoneOverdueField/>
<NotifyProjectDeadlineUpcomingField/>
<NotifyTaskDeadlineUpcomingField/>
<NotifyTaskDueSoonField/>
<NotifyTaskOverdueField/>
      </Box>)
    }