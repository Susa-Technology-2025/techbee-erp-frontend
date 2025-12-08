import {CostVarianceField} from "./PerformanceMetricsSectionFields"
import {ScheduleVarianceField} from "./PerformanceMetricsSectionFields"
import {EfficiencyPctField} from "./PerformanceMetricsSectionFields"
import {QualityRatingField} from "./PerformanceMetricsSectionFields"
import {ClientSatisfactionField} from "./PerformanceMetricsSectionFields"
import {RiskScoreField} from "./PerformanceMetricsSectionFields"
import { Box } from "@mui/material";


export const PerformanceMetricsSection = () =>{
    return ( <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "end",
        justifyContent: "start",
      }}
    >
      <CostVarianceField/>
<ScheduleVarianceField/>
<EfficiencyPctField/>
<QualityRatingField/>
<ClientSatisfactionField/>
<RiskScoreField/>
      </Box>)
    }