import {TimesheetField} from "./RelationSectionFields"
import {WbsItemField} from "./RelationSectionFields"
import { Box } from "@mui/material";


export const RelationSection = () =>{
    return ( <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "end",
        justifyContent: "start",
      }}
    >
      <TimesheetField/>
<WbsItemField/>
      </Box>)
    }