import {PercentCompletionField} from "./ProgressSectionFields"
import {ActualCompletionDateField} from "./ProgressSectionFields"
import {StatusField} from "./ProgressSectionFields"
import { Box } from "@mui/material";


export const ProgressSection = () =>{
    return ( <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "end",
        justifyContent: "start",
      }}
    >
      <PercentCompletionField/>
<ActualCompletionDateField/>
<StatusField/>
      </Box>)
    }