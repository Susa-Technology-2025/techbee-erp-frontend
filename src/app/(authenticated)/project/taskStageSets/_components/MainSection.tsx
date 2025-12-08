import {NameField} from "./MainSectionFields"
import {CodeField} from "./MainSectionFields"
import {ActiveField} from "./MainSectionFields"
import {ColorField} from "./MainSectionFields"
import {NotesField} from "./MainSectionFields"
import { Box } from "@mui/material";


export const MainSection = () =>{
    return ( <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "end",
        justifyContent: "start",
      }}
    >
      <NameField/>
<CodeField/>
<ActiveField/>
<ColorField/>
<NotesField/>
      </Box>)
    }