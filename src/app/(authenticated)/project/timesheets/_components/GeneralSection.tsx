import {EmployeeIdField} from "./GeneralSectionFields"
import {EntryCodeField} from "./GeneralSectionFields"
import {StatusField} from "./GeneralSectionFields"
import {TotalAmountField} from "./GeneralSectionFields"
import {TotalHoursField} from "./GeneralSectionFields"
import {PeriodStartField} from "./GeneralSectionFields"
import {PeriodEndField} from "./GeneralSectionFields"
import {SubmittedAtField} from "./GeneralSectionFields"
import {IdField} from "./GeneralSectionFields"
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
      <EmployeeIdField/>
<EntryCodeField/>
<StatusField/>
<TotalAmountField/>
<TotalHoursField/>
<PeriodStartField/>
<PeriodEndField/>
<SubmittedAtField/>
<IdField/>
      </Box>)
    }