import {SummaryField} from "./GeneralSectionFields"
import {NotesField} from "./GeneralSectionFields"
import {StatusField} from "./GeneralSectionFields"
import {TypeField} from "./GeneralSectionFields"
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
      <SummaryField/>
<NotesField/>
<StatusField/>
<TypeField/>
      </Box>)
    }