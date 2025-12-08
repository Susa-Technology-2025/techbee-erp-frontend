import {ProjectStageNameField} from "./MainSectionFields"
import {ProjectStageCodeField} from "./MainSectionFields"
import {ProjectStageSequenceField} from "./MainSectionFields"
import {ProjectStageActiveField} from "./MainSectionFields"
import {ProjectStageRequiresApprovalField} from "./MainSectionFields"
import {ProjectStageSetFieldAutocomplete} from "./MainSectionFields"
import {ProjectStageColorField} from "./MainSectionFields"
import {ProjectStageDescriptionField} from "./MainSectionFields"
import {ProjectStageNotesField} from "./MainSectionFields"
import {ProjectStageTriggersNotificationField} from "./MainSectionFields"
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
      <ProjectStageNameField/>
<ProjectStageCodeField/>
<ProjectStageSequenceField/>
<ProjectStageActiveField/>
<ProjectStageRequiresApprovalField/>
<ProjectStageSetFieldAutocomplete/>
<ProjectStageColorField/>
<ProjectStageDescriptionField/>
<ProjectStageNotesField/>
<ProjectStageTriggersNotificationField/>
      </Box>)
    }