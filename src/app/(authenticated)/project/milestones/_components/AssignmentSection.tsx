import {AssignedTeamOrDeptField} from "./AssignmentSectionFields"
import {ResponsibleOwnerField} from "./AssignmentSectionFields"
import { Box } from "@mui/material";


export const AssignmentSection = () =>{
    return ( <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "end",
        justifyContent: "start",
      }}
    >
      <AssignedTeamOrDeptField/>
<ResponsibleOwnerField/>
      </Box>)
    }