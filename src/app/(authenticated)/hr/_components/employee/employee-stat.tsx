import { Box, Paper, Typography } from "@mui/material";

const EmployeeStat = () => {
  const stats = [
    { label: "Total", value: 57, color: "primary.main" },
    { label: "Active", value: 48, color: "success.main" },
    { label: "Leave", value: 5, color: "warning.main" },
    { label: "Probation", value: 4, color: "info.main" },
  ];

  return (
    <Box
      display="flex"
      flexWrap="wrap"
      justifyContent="start"
      gap={1}
      sx={{ mb: 2, px: 1, width: "90%", mx: "auto" }}
    >
      {stats.map((stat, index) => (
        <Paper
          key={index}
          elevation={1}
          sx={{
            flex: "1 1 45%",
            minWidth: "110px",
            maxWidth: "130px",
            height: "80px",
            p: 1,
            borderRadius: 1.5,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: "1rem",
              fontWeight: 600,
              color: stat.color,
              lineHeight: 1.2,
            }}
          >
            {stat.value}
          </Typography>
          <Typography
            sx={{
              fontSize: "0.7rem",
              fontWeight: 500,
              color: "text.secondary",
              lineHeight: 1.1,
            }}
          >
            {stat.label}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
};

export default EmployeeStat;
