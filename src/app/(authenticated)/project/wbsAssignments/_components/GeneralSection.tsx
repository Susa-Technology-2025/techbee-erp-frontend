import {ExternalMemberNameField} from "./GeneralSectionFields"
import {ExternalResourceNameField} from "./GeneralSectionFields"
import {RoleField} from "./GeneralSectionFields"
import {AllocationPercentField} from "./GeneralSectionFields"
import {UserIdField} from "./GeneralSectionFields"
import {StartDateField} from "./GeneralSectionFields"
import {EndDateField} from "./GeneralSectionFields"
import {WbsItemField} from "./GeneralSectionFields"
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
      <ExternalMemberNameField/>
<ExternalResourceNameField/>
<RoleField/>
<AllocationPercentField/>
<UserIdField/>
<StartDateField/>
<EndDateField/>
<WbsItemField/>
      </Box>)
    }