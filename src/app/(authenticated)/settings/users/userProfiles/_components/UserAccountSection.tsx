import {UserField} from "./UserAccountSectionFields"
import { Box } from "@mui/material";


export const UserAccountSection = () =>{
    return ( <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "end",
        justifyContent: "start",
      }}
    >
      <UserField/>
      </Box>)
    }