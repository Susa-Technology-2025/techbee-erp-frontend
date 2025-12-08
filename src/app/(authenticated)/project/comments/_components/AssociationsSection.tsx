import {MilestoneField} from "./AssociationsSectionFields"
import {ParentCommentField} from "./AssociationsSectionFields"
import {WbsItemField} from "./AssociationsSectionFields"
import {RepliesField} from "./AssociationsSectionFields"
import { Box } from "@mui/material";


export const AssociationsSection = () =>{
    return ( <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "end",
        justifyContent: "start",
      }}
    >
      <MilestoneField/>
<ParentCommentField/>
<WbsItemField/>
<RepliesField/>
      </Box>)
    }