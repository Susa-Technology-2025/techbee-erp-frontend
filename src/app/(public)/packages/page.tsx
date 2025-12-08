import { packages } from "@/lib/constants/packages";
import { Box, Typography, Button, Link } from "@mui/material";
import { RequestQuote, HelpCenter } from "@mui/icons-material";
import TabsClient from "./price-options";
import { ReusableBG } from "@/components/animations/shapes";

export default function PricingPage() {
  return (
    <Box sx={{ maxWidth: 1400, mx: "auto", px: { xs: 2, md: 6 }, py: 8 }}>
      <ReusableBG />

      <Box textAlign="center" mb={8}>
        <Typography
          variant="h2"
          fontWeight={800}
          gutterBottom
          sx={{ fontSize: { xs: "2.2rem", md: "3rem" }, color: "#fff" }}
        >
          Simple, Transparent Pricing
        </Typography>
        <Typography variant="h6" sx={{ color: "#fff" }} mb={4}>
          Choose the perfect plan for your business needs
        </Typography>

        <TabsClient packages={packages} />

        <Link
          href="/how-to"
          component={Link}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mt: 4,
          }}
        >
          <HelpCenter sx={{ mr: 1 }} /> How to get started with Addis ERP
        </Link>
      </Box>

      <Box
        textAlign="center"
        mt={2}
        sx={{ backgroundColor: "section.main", p: 2, borderRadius: 2 }}
      >
        <Typography
          sx={{ color: "section.contrastText" }}
          variant="h5"
          gutterBottom
          fontWeight={600}
        >
          Need something more powerful?
        </Typography>
        <Typography
          sx={{ color: "section.contrastText" }}
          mb={4}
          maxWidth={700}
          mx="auto"
        >
          Our enterprise solutions team can create a fully customized package
          for your organization's unique requirements.
        </Typography>
        <Button
          variant="contained"
          size="large"
          href="/contact"
          component={Link}
          startIcon={<RequestQuote />}
          sx={{ px: 6, py: 1.5, fontWeight: 600 }}
        >
          Request a Demo
        </Button>
      </Box>
    </Box>
  );
}
