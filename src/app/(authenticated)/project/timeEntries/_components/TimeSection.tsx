import {StartTimeField} from "./TimeSectionFields"
import {EndTimeField} from "./TimeSectionFields"
import {WorkDateField} from "./TimeSectionFields"
import { Box } from "@mui/material";


export const TimeSection = () =>{
    return ( <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "end",
        justifyContent: "start",
      }}
    >
      <StartTimeField/>
<EndTimeField/>
<WorkDateField/>
      </Box>)
    }