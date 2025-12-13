import {UsernameField} from "./GeneralSectionFields"
import {EmailField} from "./GeneralSectionFields"
import {PasswordField} from "./GeneralSectionFields"
import {FirstNameField} from "./GeneralSectionFields"
import {LastNameField} from "./GeneralSectionFields"
import {PhoneNumberField} from "./GeneralSectionFields"
import {TenantCodeField} from "./GeneralSectionFields"
import {TypeFieldField} from "./GeneralSectionFields"
import {SignupSourceField} from "./GeneralSectionFields"
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
      <UsernameField/>
<EmailField/>
<PasswordField/>
<FirstNameField/>
<LastNameField/>
<PhoneNumberField/>
<TenantCodeField/>
<TypeFieldField/>
<SignupSourceField/>
      </Box>)
    }