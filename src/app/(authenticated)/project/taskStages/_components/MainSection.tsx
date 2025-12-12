import {TaskStageNameField} from "./MainSectionFields"
import {TaskStageCodeField} from "./MainSectionFields"
import {TaskStageSequenceField} from "./MainSectionFields"
import {TaskStageSetField} from "./MainSectionFields"
import {TaskStageActiveField} from "./MainSectionFields"
import {TaskStageTriggersNotificationField} from "./MainSectionFields"
import { Box } from "@mui/material";


export const MainSection = () =>{
    return ( <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "end",
        justifyContent: "start",
      }}
    >
      <TaskStageNameField/>
<TaskStageCodeField/>
<TaskStageSequenceField/>
<TaskStageSetField/>
<TaskStageActiveField/>
<TaskStageTriggersNotificationField/>
      </Box>)
    }