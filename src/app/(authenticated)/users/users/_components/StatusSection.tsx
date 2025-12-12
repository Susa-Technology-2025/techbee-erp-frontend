import {IsActiveField} from "./StatusSectionFields"
import {IsVerifiedField} from "./StatusSectionFields"
import {MustResetPasswordField} from "./StatusSectionFields"
import {EmailVerifiedAtField} from "./StatusSectionFields"
import { Box } from "@mui/material";


export const StatusSection = () =>{
    return ( <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "end",
        justifyContent: "start",
      }}
    >
      <IsActiveField/>
<IsVerifiedField/>
<MustResetPasswordField/>
<EmailVerifiedAtField/>
      </Box>)
    }