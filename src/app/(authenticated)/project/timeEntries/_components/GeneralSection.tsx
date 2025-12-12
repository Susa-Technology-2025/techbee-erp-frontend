import {TypeField} from "./GeneralSectionFields"
import {BillableField} from "./GeneralSectionFields"
import {EmployeeIdField} from "./GeneralSectionFields"
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
<BillableField/>
<EmployeeIdField/>
      </Box>)
    }