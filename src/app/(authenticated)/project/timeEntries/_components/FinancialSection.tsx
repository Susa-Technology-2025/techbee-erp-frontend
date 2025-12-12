import {AmountField} from "./FinancialSectionFields"
import {HourlyRateField} from "./FinancialSectionFields"
import { Box } from "@mui/material";


export const FinancialSection = () =>{
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
<HourlyRateField/>
      </Box>)
    }