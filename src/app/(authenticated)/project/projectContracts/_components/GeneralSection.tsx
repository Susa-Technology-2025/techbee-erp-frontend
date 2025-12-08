import {NotesField} from "./GeneralSectionFields"
import {LinkedInvoiceRefField} from "./GeneralSectionFields"
import {CurrencyField} from "./GeneralSectionFields"
import {DefaultRateField} from "./GeneralSectionFields"
import {BillingMethodField} from "./GeneralSectionFields"
import {ProjectField} from "./GeneralSectionFields"
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
      <NotesField/>
<LinkedInvoiceRefField/>
<CurrencyField/>
<DefaultRateField/>
<BillingMethodField/>
<ProjectField/>
      </Box>)
    }