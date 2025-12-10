import {TitleField} from "./GeneralSectionFields"
import {TotalPercentCompletionField} from "./GeneralSectionFields"
import {CustomerNameField} from "./GeneralSectionFields"
import {DepartmentOrCostCenterField} from "./GeneralSectionFields"
import {DescriptionField} from "./GeneralSectionFields"
import {ProjectManagerEmployeeIdField} from "./GeneralSectionFields"
import {ProjectStageField} from "./GeneralSectionFields"
import {ProjectTypeField} from "./GeneralSectionFields"
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
      <TitleField/>
<TotalPercentCompletionField/>
<CustomerNameField/>
<DepartmentOrCostCenterField/>
<DescriptionField/>
<ProjectManagerEmployeeIdField/>
<ProjectStageField/>
<ProjectTypeField/>
      </Box>)
    }