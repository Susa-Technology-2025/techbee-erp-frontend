import {DescriptionField} from "./DetailsSectionFields"
import {ReasonField} from "./DetailsSectionFields"
import {CommentsNotesField} from "./DetailsSectionFields"
import { Box } from "@mui/material";


export const DetailsSection = () =>{
    return ( <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "end",
        justifyContent: "start",
      }}
    >
      <DescriptionField/>
<ReasonField/>
<CommentsNotesField/>
      </Box>)
    }