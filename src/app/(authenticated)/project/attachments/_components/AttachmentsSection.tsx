import {UrlField} from "./AttachmentsSectionFields"
import { Box } from "@mui/material";


export const AttachmentsSection = () =>{
    return ( <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "end",
        justifyContent: "start",
      }}
    >
      <UrlField/>
      </Box>)
    }