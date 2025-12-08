import {ApprovalRequiredField} from "./SettingsSectionFields"
import {DefaultWbsTemplateIdField} from "./SettingsSectionFields"
import {DefaultBillingMethodField} from "./SettingsSectionFields"
import {DefaultProjectStageSetField} from "./SettingsSectionFields"
import {DefaultTaskStageSetField} from "./SettingsSectionFields"
import { Box } from "@mui/material";


export const SettingsSection = () =>{
    return ( <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "end",
        justifyContent: "start",
      }}
    >
      <ApprovalRequiredField/>
<DefaultWbsTemplateIdField/>
<DefaultBillingMethodField/>
<DefaultProjectStageSetField/>
<DefaultTaskStageSetField/>
      </Box>)
    }