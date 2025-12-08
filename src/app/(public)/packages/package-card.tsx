import {
  Paper,
  Box,
  Stack,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  Button,
  Link,
} from "@mui/material";
import { CheckCircle } from "@mui/icons-material";

export default function PackageCard({ pkg, price, billingCycle }: any) {
  return (
    <Paper
      elevation={pkg.highlight ? 6 : 2}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        border: pkg.highlight ? "2px solid" : "none",
        borderColor: pkg.highlight ? "primary.main" : "transparent",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {pkg.highlight && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            bgcolor: "primary.main",
            color: "white",
            px: 2,
            py: 0.5,
            fontSize: "0.8rem",
            fontWeight: 600,
            borderBottomLeftRadius: 8,
          }}
        >
          MOST POPULAR
        </Box>
      )}

      <Box sx={{ p: 4, flexGrow: 1 }}>
        <Stack direction="row" alignItems="center" spacing={1} mb={2}>
          {pkg.icon}
          <Typography variant="h5" fontWeight={700}>
            {pkg.name}
          </Typography>
        </Stack>

        <Box mb={3}>
          <Typography variant="h3" fontWeight={800}>
            {price}
          </Typography>
          <Typography color="text.secondary">
            {pkg.desc} {billingCycle === "yearly" && "(billed annually)"}
          </Typography>
        </Box>

        <Typography color="text.secondary" mb={3}>
          {pkg.bestFor}
        </Typography>

        <Divider sx={{ my: 3 }} />

        <List dense>
          {pkg.features.map((feature: string) => (
            <ListItem key={feature} sx={{ px: 0 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <CheckCircle color="primary" fontSize="small" />
              </ListItemIcon>
              <Typography variant="body2">{feature}</Typography>
            </ListItem>
          ))}
        </List>
      </Box>

      <Box sx={{ p: 3, pt: 0 }}>
        <Button
          fullWidth
          variant={pkg.highlight ? "contained" : "outlined"}
          size="large"
          href={pkg.name === "Custom" ? "/contact" : "/auth"}
          component={Link}
          sx={{
            py: 2,
            fontWeight: 600,
            ...(pkg.highlight && {
              bgcolor: "primary.dark",
              "&:hover": { bgcolor: "primary.main" },
            }),
          }}
        >
          {pkg.ctaText}
        </Button>
      </Box>
    </Paper>
  );
}
