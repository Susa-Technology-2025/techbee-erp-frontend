import {OrgNodesField} from "./RolesAndOrganizationsSectionFields"
import {UserRolesField} from "./RolesAndOrganizationsSectionFields"
import { Box } from "@mui/material";


export const RolesAndOrganizationsSection = () =>{
    return ( <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "end",
        justifyContent: "start",
      }}
    >
      <OrgNodesField/>
<UserRolesField/>
      </Box>)
    }