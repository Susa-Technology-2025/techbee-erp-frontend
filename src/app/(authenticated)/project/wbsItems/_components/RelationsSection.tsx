import {MilestoneField} from "./RelationsSectionFields"
import {ProjectField} from "./RelationsSectionFields"
import {ParentField} from "./RelationsSectionFields"
import {TaskStageField} from "./RelationsSectionFields"
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
      <MilestoneField/>
<ProjectField/>
<ParentField/>
<TaskStageField/>
      </Box>)
    }