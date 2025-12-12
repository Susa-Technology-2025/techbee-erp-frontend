import {RequestedByEmployeeIdField} from "./RequestorSectionFields"
import { Box } from "@mui/material";


export const RequestorSection = () =>{
    return ( <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "end",
        justifyContent: "start",
      }}
    >
      <RequestedByEmployeeIdField/>
      </Box>)
    }