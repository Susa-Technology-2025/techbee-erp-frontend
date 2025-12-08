import {NameField} from "./GeneralSectionFields"
import {CodeField} from "./GeneralSectionFields"
import {ActiveField} from "./GeneralSectionFields"
import {DescriptionField} from "./GeneralSectionFields"
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
<CodeField/>
<ActiveField/>
<DescriptionField/>
      </Box>)
    }