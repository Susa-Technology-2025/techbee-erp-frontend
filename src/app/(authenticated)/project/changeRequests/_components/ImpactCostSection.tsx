import {BillingAmountField} from "./ImpactCostSectionFields"
import {ImpactCostField} from "./ImpactCostSectionFields"
import {ImpactTimeDaysField} from "./ImpactCostSectionFields"
import {ImpactResourcesField} from "./ImpactCostSectionFields"
import { Box } from "@mui/material";


export const ImpactCostSection = () =>{
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