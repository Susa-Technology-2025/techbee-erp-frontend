import {BillingAmountField} from "./CostAndImpactSectionFields"
import {ImpactCostField} from "./CostAndImpactSectionFields"
import {ImpactTimeDaysField} from "./CostAndImpactSectionFields"
import {ImpactResourcesField} from "./CostAndImpactSectionFields"
import { Box } from "@mui/material";


export const CostAndImpactSection = () =>{
    return ( <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "end",
        justifyContent: "start",
      }}
    >
      <BillingAmountField/>
<ImpactCostField/>
<ImpactTimeDaysField/>
<ImpactResourcesField/>
      </Box>)
    }