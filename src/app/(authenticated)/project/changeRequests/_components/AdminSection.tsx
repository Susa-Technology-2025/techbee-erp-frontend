import {ApprovalStatusField} from "./AdminSectionFields"
import { Box } from "@mui/material";


export const AdminSection = () =>{
    return ( <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "end",
        justifyContent: "start",
      }}
    >
      <ApprovalStatusField/>
      </Box>)
    }