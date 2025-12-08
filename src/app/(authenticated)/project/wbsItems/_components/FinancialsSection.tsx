import {ActualCostField} from "./FinancialsSectionFields"
import {BudgetEstimateField} from "./FinancialsSectionFields"
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
      <ActualCostField/>
<BudgetEstimateField/>
      </Box>)
    }