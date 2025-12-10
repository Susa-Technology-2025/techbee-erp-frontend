import {NameField} from "./GeneralSectionFields"
import {StatusField} from "./GeneralSectionFields"
import {ResourceNameField} from "./GeneralSectionFields"
import {TaskNameField} from "./GeneralSectionFields"
import {CompanyField} from "./GeneralSectionFields"
import {OwnerField} from "./GeneralSectionFields"
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
      <NameField/>
<StatusField/>
<ResourceNameField/>
<TaskNameField/>
<CompanyField/>
<OwnerField/>
<WbsItemField/>
      </Box>)
    }