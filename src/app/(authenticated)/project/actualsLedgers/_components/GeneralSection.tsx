import {AmountField} from "./GeneralSectionFields"
import {CategoryField} from "./GeneralSectionFields"
import {CurrencyField} from "./GeneralSectionFields"
import {DateField} from "./GeneralSectionFields"
import {DescriptionField} from "./GeneralSectionFields"
import {IsBillableField} from "./GeneralSectionFields"
import {IsInvoicedField} from "./GeneralSectionFields"
import {SourceIdField} from "./GeneralSectionFields"
import {SourceTypeField} from "./GeneralSectionFields"
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
      <AmountField/>
<CategoryField/>
<CurrencyField/>
<DateField/>
<DescriptionField/>
<IsBillableField/>
<IsInvoicedField/>
<SourceIdField/>
<SourceTypeField/>
<WbsItemField/>
      </Box>)
    }