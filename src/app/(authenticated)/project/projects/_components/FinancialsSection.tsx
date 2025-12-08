import {CurrencyField} from "./FinancialsSectionFields"
import {ActualCostField} from "./FinancialsSectionFields"
import {TotalBudgetField} from "./FinancialsSectionFields"
import {VarianceField} from "./FinancialsSectionFields"
import {BillingMethodField} from "./FinancialsSectionFields"
import { Box } from "@mui/material";


export const FinancialsSection = () =>{
    return ( <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "end",
        justifyContent: "start",
      }}
    >
      <CurrencyField/>
<ActualCostField/>
<TotalBudgetField/>
<VarianceField/>
<BillingMethodField/>
      </Box>)
    }