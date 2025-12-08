import {WbsItemField} from "./RelationsSectionFields"
import {SchedulingTypeField} from "./RelationsSectionFields"
import { Box } from "@mui/material";


export const RelationsSection = () =>{
    return ( <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "end",
        justifyContent: "start",
      }}
    >
      <WbsItemField/>
<SchedulingTypeField/>
      </Box>)
    }