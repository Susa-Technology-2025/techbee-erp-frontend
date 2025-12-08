import {CommentsField} from "./OtherSectionFields"
import { Box } from "@mui/material";


export const OtherSection = () =>{
    return ( <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "end",
        justifyContent: "start",
      }}
    >
      <CommentsField/>
      </Box>)
    }