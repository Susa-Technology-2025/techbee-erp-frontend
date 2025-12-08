import {PercentCompletionField} from "./ProgressSectionFields"
import {WeightPercentField} from "./ProgressSectionFields"
import {StatusLabelField} from "./ProgressSectionFields"
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
<WeightPercentField/>
<StatusLabelField/>
      </Box>)
    }