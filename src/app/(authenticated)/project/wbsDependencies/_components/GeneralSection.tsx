import {TypeField} from "./GeneralSectionFields"
import {LagDaysField} from "./GeneralSectionFields"
import {FromFieldField} from "./GeneralSectionFields"
import {ToField} from "./GeneralSectionFields"
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
      <TypeField/>
<LagDaysField/>
<FromFieldField/>
<ToField/>
      </Box>)
    }