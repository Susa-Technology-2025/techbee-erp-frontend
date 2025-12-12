import {NameField} from "./GeneralSectionFields"
import {IsActiveField} from "./GeneralSectionFields"
import {DescriptionField} from "./GeneralSectionFields"
import {OrganizationNodeIdField} from "./GeneralSectionFields"
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
      <NameField/>
<IsActiveField/>
<DescriptionField/>
<OrganizationNodeIdField/>
      </Box>)
    }