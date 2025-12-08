import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Link,
  Divider,
  Stack,
} from "@mui/material";

const Footer = async () => {
  "use cache";
  return (
    <Box
      component="footer"
      className="footer-bg"
      sx={{
        bgcolor: "section.main",
        color: "section.contrastText",
        ml: { xs: 0, md: 2 },
        mt: 8,
        pt: 10,
        pb: 6,
        position: "relative",
        zIndex: 2,
        borderTopLeftRadius: "4rem",
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 3 }}>
        <Grid container spacing={6} alignItems={"center"}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box
              sx={{
                mb: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 2,
              }}
            >
              <Typography
                variant="body1"
                component="p"
                color="primary.main"
                fontWeight={700}
              >
                TechBee Enterprise Solutions
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ pr: 2 }}>
              Empowering businesses with intelligent ERP solutions that adapt
              and scale with your growth.
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography
              variant="subtitle1"
              component="p"
              color="section.contrastText"
              fontWeight={600}
              gutterBottom
            >
              Product
            </Typography>

            <Stack spacing={1}>
              <Link href="#" underline="hover" color="inherit">
                Features
              </Link>
              <Link href="#" underline="hover" color="inherit">
                Pricing
              </Link>
              <Link href="#" underline="hover" color="inherit">
                Mobile App
              </Link>
              <Link href="#" underline="hover" color="inherit">
                Integrations
              </Link>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography
              variant="subtitle1"
              component="p"
              color="section.contrastText"
              fontWeight={600}
              gutterBottom
            >
              Company
            </Typography>
            <Stack spacing={1}>
              <Link href="#" underline="hover" color="inherit">
                About Us
              </Link>
              <Link href="#" underline="hover" color="inherit">
                Careers
              </Link>
              <Link href="#" underline="hover" color="inherit">
                Blog
              </Link>
              <Link href="#" underline="hover" color="inherit">
                Contact
              </Link>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography
              variant="subtitle1"
              component="p"
              color="section.contrastText"
              fontWeight={600}
              gutterBottom
            >
              Support
            </Typography>
            <Stack spacing={1}>
              <Link href="#" underline="hover" color="inherit">
                Help Center
              </Link>
              <Link href="#" underline="hover" color="inherit">
                Documentation
              </Link>
              <Link href="#" underline="hover" color="inherit">
                System Status
              </Link>
              <Link href="#" underline="hover" color="inherit">
                Privacy Policy
              </Link>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 5, opacity: 0.1 }} />

        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
          textAlign={{ xs: "center", sm: "left" }}
          gap={2}
          sx={{
            px: { xs: 2, sm: 4 },
            py: 3,
          }}
        >
          <Typography
            variant="body2"
            sx={{ wordBreak: "break-word", maxWidth: "100%" }}
          >
            &copy; {new Date().getFullYear()} TechBee Enterprise Solutions. All
            rights reserved.
          </Typography>
          <Stack direction="row" spacing={2}>
            <Link href="#" color="inherit" underline="hover">
              Terms
            </Link>
            <Link href="#" color="inherit" underline="hover">
              Privacy
            </Link>
            <Link href="#" color="inherit" underline="hover">
              Cookies
            </Link>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
