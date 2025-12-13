import {BackendEndpointField} from "./EndpointsSectionFields"
import {FrontendEndpointField} from "./EndpointsSectionFields"
import { Box } from "@mui/material";


export const EndpointsSection = () =>{
    return ( <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "end",
        justifyContent: "start",
      }}
    >
      <BackendEndpointField/>
<FrontendEndpointField/>
      </Box>)
    }