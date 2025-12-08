import {EntriesField} from "./EntriesSectionFields"
import { Box } from "@mui/material";


export const EntriesSection = () =>{
    return ( <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "end",
        justifyContent: "start",
      }}
    >
      <EntriesField/>
      </Box>)
    }