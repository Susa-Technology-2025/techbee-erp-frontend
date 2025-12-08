import { Typography } from "@mui/material";

export const FormDescription = ({ text }: { text: string }) => (
  <Typography sx={{
    fontWeight: "bolder",
    padding: 1,
    textAlign: "center"

  }} variant="body1" gutterBottom>
    {text}
  </Typography>
);
