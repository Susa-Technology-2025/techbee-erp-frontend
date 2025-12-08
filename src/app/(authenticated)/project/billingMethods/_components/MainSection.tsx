import {MethodField} from "./MainSectionFields"
import {ActiveField} from "./MainSectionFields"
import {DescriptionField} from "./MainSectionFields"
import {ProjectTypesDefaultForField} from "./MainSectionFields"
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
      <MethodField/>
<ActiveField/>
<DescriptionField/>
<ProjectTypesDefaultForField/>
      </Box>)
    }