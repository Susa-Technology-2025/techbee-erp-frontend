import {StagesField} from "./StagesSectionFields"
import { Box } from "@mui/material";


export const StagesSection = () =>{
    return ( <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "end",
        justifyContent: "start",
      }}
    >
      <StagesField/>
      </Box>)
    }