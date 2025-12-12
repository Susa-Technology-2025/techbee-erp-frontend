import {ProjectField} from "./MainSectionFields"
import {IsOwnerField} from "./MainSectionFields"
import {UserIdField} from "./MainSectionFields"
import {ExternalMemberNameField} from "./MainSectionFields"
import {RoleField} from "./MainSectionFields"
import {AllocationPercentField} from "./MainSectionFields"
import {StartDateField} from "./MainSectionFields"
import {EndDateField} from "./MainSectionFields"
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
      <ProjectField/>
<IsOwnerField/>
<UserIdField/>
<ExternalMemberNameField/>
<RoleField/>
<AllocationPercentField/>
<StartDateField/>
<EndDateField/>
      </Box>)
    }