import {EntryCodeField} from "./DetailsSectionFields"
import {TaskOrActivityField} from "./DetailsSectionFields"
import {NotesField} from "./DetailsSectionFields"
import {DurationHoursField} from "./DetailsSectionFields"
import {AttachmentUrlField} from "./DetailsSectionFields"
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
      <EntryCodeField/>
<TaskOrActivityField/>
<NotesField/>
<DurationHoursField/>
<AttachmentUrlField/>
      </Box>)
    }