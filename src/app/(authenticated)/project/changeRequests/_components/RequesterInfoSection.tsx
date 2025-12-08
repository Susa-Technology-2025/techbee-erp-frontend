import {RequestedByNameField} from "./RequesterInfoSectionFields"
import {RequestedByEmployeeIdField} from "./RequesterInfoSectionFields"
import { Box } from "@mui/material";


export const RequesterInfoSection = () =>{
    return ( <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "end",
        justifyContent: "start",
      }}
    >
      <RequestedByNameField/>
<RequestedByEmployeeIdField/>
      </Box>)
    }