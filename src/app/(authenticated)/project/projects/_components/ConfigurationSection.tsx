import {ApprovalRequiredField} from "./ConfigurationSectionFields"
import {RiskFlagField} from "./ConfigurationSectionFields"
import {NotifyMemberInvitedField} from "./ConfigurationSectionFields"
import {NotifyProjectAssignmentChangedField} from "./ConfigurationSectionFields"
import {TaskStageSetField} from "./ConfigurationSectionFields"
import { Box } from "@mui/material";


export const ConfigurationSection = () =>{
    return ( <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "end",
        justifyContent: "start",
      }}
    >
      <ApprovalRequiredField/>
<RiskFlagField/>
<NotifyMemberInvitedField/>
<NotifyProjectAssignmentChangedField/>
<TaskStageSetField/>
      </Box>)
    }