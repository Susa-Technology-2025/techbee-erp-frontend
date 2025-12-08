import { Card, Paper } from "@mui/material";
import Link from "next/link";

export default () => {
  return (
    <Paper>
      <Card component={Link} href={"/super-admin/constants/permissions"}>
        Permissions
      </Card>
    </Paper>
  );
};
