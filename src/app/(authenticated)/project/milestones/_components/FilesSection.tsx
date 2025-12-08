import {AttachmentsField} from "./FilesSectionFields"
import { Box } from "@mui/material";


export const FilesSection = () =>{
    return ( <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "end",
        justifyContent: "start",
      }}
    >
      <AttachmentsField/>
      </Box>)
    }