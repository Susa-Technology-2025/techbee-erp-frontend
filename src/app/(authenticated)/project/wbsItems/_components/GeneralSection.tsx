import {TitleField} from "./GeneralSectionFields"
import {CodeField} from "./GeneralSectionFields"
import {TypeField} from "./GeneralSectionFields"
import {SlaStateField} from "./GeneralSectionFields"
import {ApprovalRequiredField} from "./GeneralSectionFields"
import {NotifyTaskAssignmentChangedField} from "./GeneralSectionFields"
import {OrderField} from "./GeneralSectionFields"
import {DescriptionField} from "./GeneralSectionFields"
import {NotesField} from "./GeneralSectionFields"
import {ResponsibleRoleOrNameField} from "./GeneralSectionFields"
import {RiskOrIssuesField} from "./GeneralSectionFields"
import {DeliverablesField} from "./GeneralSectionFields"
import { Box } from "@mui/material";


export const GeneralSection = () =>{
    return ( <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "end",
        justifyContent: "start",
      }}
    >
      <TitleField/>
<CodeField/>
<TypeField/>
<SlaStateField/>
<ApprovalRequiredField/>
<NotifyTaskAssignmentChangedField/>
<OrderField/>
<DescriptionField/>
<NotesField/>
<ResponsibleRoleOrNameField/>
<RiskOrIssuesField/>
<DeliverablesField/>
      </Box>)
    }