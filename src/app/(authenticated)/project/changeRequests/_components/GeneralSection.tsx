import {TitleField} from "./GeneralSectionFields"
import {ChangeTypeField} from "./GeneralSectionFields"
import {PriorityField} from "./GeneralSectionFields"
import {WbsItemField} from "./GeneralSectionFields"
import { Box } from "@mui/material";


export const GeneralSection = () =>{
    return ( <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "end",
        justifyContent: "start",
      }}
    >
      <TitleField/>
<ChangeTypeField/>
<PriorityField/>
<WbsItemField/>
      </Box>)
    }