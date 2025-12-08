import {DescriptionField} from "./DetailsSectionFields"
import {NotesField} from "./DetailsSectionFields"
import {DeliverablesField} from "./DetailsSectionFields"
import {NotificationsPolicyField} from "./DetailsSectionFields"
import {CommentsField} from "./DetailsSectionFields"
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
<NotesField/>
<DeliverablesField/>
<NotificationsPolicyField/>
<CommentsField/>
      </Box>)
    }