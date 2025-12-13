import {RolePermissionsField} from "./PermissionsSectionFields"
import { Box } from "@mui/material";


export const PermissionsSection = () =>{
    return ( <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "end",
        justifyContent: "start",
      }}
    >
      <RolePermissionsField/>
      </Box>)
    }