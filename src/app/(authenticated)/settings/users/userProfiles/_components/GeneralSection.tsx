import {AddressField} from "./GeneralSectionFields"
import {AvatarUrlField} from "./GeneralSectionFields"
import {BioField} from "./GeneralSectionFields"
import {DateOfBirthField} from "./GeneralSectionFields"
import {GenderField} from "./GeneralSectionFields"
import {LocaleField} from "./GeneralSectionFields"
import {NationalityField} from "./GeneralSectionFields"
import {TimezoneField} from "./GeneralSectionFields"
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
      <AddressField/>
<AvatarUrlField/>
<BioField/>
<DateOfBirthField/>
<GenderField/>
<LocaleField/>
<NationalityField/>
<TimezoneField/>
      </Box>)
    }