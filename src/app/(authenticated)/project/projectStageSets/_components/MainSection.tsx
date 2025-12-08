import {ProjectStageSetNameField} from "./MainSectionFields"
import {ProjectStageSetCodeField} from "./MainSectionFields"
import {ProjectStageSetActiveField} from "./MainSectionFields"
import { Box } from "@mui/material";


export const MainSection = () =>{
    return ( <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "end",
        justifyContent: "start",
      }}
    >
      <ProjectStageSetNameField/>
<ProjectStageSetCodeField/>
<ProjectStageSetActiveField/>
      </Box>)
    }