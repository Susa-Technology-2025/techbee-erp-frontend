import {BodyField} from "./GeneralSectionFields"
import {IsInternalField} from "./GeneralSectionFields"
import {AuthorEmployeeIdField} from "./GeneralSectionFields"
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
      <BodyField/>
<IsInternalField/>
<AuthorEmployeeIdField/>
      </Box>)
    }