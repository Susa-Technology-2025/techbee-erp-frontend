import {FileNameField} from "./GeneralSectionFields"
import {DescriptionField} from "./GeneralSectionFields"
import {MimeTypeField} from "./GeneralSectionFields"
import {SizeBytesField} from "./GeneralSectionFields"
import {VersionField} from "./GeneralSectionFields"
import {UploadedByUserIdField} from "./GeneralSectionFields"
import {MilestoneField} from "./GeneralSectionFields"
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
      <FileNameField/>
<DescriptionField/>
<MimeTypeField/>
<SizeBytesField/>
<VersionField/>
<UploadedByUserIdField/>
<MilestoneField/>
<WbsItemField/>
      </Box>)
    }