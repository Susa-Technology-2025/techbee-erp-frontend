import {NameField} from "./GeneralSectionFields"
import {CodeField} from "./GeneralSectionFields"
import {HubField} from "./GeneralSectionFields"
import {ActionField} from "./GeneralSectionFields"
import {MethodField} from "./GeneralSectionFields"
import {ModuleFieldField} from "./GeneralSectionFields"
import {EntityField} from "./GeneralSectionFields"
import {ServiceField} from "./GeneralSectionFields"
import {IsActiveField} from "./GeneralSectionFields"
import {DescriptionField} from "./GeneralSectionFields"
import {LastSyncedAtField} from "./GeneralSectionFields"
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
      <NameField/>
<CodeField/>
<HubField/>
<ActionField/>
<MethodField/>
<ModuleFieldField/>
<EntityField/>
<ServiceField/>
<IsActiveField/>
<DescriptionField/>
<LastSyncedAtField/>
      </Box>)
    }