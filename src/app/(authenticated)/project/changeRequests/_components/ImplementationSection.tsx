import {ImplementationPlanField} from "./ImplementationSectionFields"
import {NotificationsPolicyField} from "./ImplementationSectionFields"
import { Box } from "@mui/material";


export const ImplementationSection = () =>{
    return ( <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "end",
        justifyContent: "start",
      }}
    >
      <ImplementationPlanField/>
<NotificationsPolicyField/>
      </Box>)
    }