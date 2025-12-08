import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Stack,
} from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import LanguageIcon from "@mui/icons-material/Language";
import PaymentIcon from "@mui/icons-material/Payment";
import CodeIcon from "@mui/icons-material/Code";
import PublicIcon from "@mui/icons-material/Public";
import FlagIcon from "@mui/icons-material/Flag";

export default function WhyUs() {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        px: { xs: 3, md: 8 },
        backgroundColor: "background.paper",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        component="svg"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          backgroundColor: "section.main",
          clipPath: "polygon(0 0, 100% 0, 100% 23%, 75% 46%, 30% 65%, 0 72%)",
        }}
      >
        <path
          fill="currentColor"
          fillOpacity="0.08"
          d="M0,128L60,144C120,160,240,192,360,192C480,192,600,160,720,138.7C840,117,960,107,1080,128C1200,149,1320,203,1380,229.3L1440,256L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
        />
      </Box>

      <Typography
        variant="h3"
        fontWeight={700}
        textAlign="center"
        gutterBottom
        sx={{ color: "section.contrastText", position: "relative", zIndex: 1 }}
      >
        Why Choose{" "}
        <Box component="span" sx={{ color: "section.contrastText" }}>
          TechBee ERP
        </Box>
        ?
      </Typography>

      <Typography
        variant="h6"
        textAlign="center"
        sx={{
          mb: 6,
          color: "section.contrastText",
          position: "relative",
          zIndex: 1,
        }}
      >
        Empowering Ethiopian organizations with a fully native ERP—built for
        local needs, ready for global growth.
      </Typography>

      <Grid container spacing={4} sx={{ position: "relative", zIndex: 1 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={3} sx={{ height: "100%" }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                <CodeIcon color="primary" fontSize="large" />
                <Typography variant="h6" fontWeight={600}>
                  100% Built by Ethiopians
                </Typography>
              </Stack>
              <Typography sx={{ color: "text.secondary" }}>
                TechBee ERP is developed entirely by Ethiopian engineers—from
                frontend to backend— ensuring complete control, customization,
                and cultural relevance.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={3}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                <VerifiedIcon color="primary" fontSize="large" />
                <Typography variant="h6" fontWeight={600}>
                  Native ERP, Not Based on Odoo
                </Typography>
              </Stack>
              <Typography sx={{ color: "text.secondary" }}>
                Unlike most ERP solutions in Ethiopia that rely on expensive
                Odoo platforms, TechBee ERP is natively built for performance,
                security, and affordability—no costly third-party dependencies.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={3}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                <PaymentIcon color="primary" fontSize="large" />
                <Typography variant="h6" fontWeight={600}>
                  Deep Integration with Ethiopian Banks & Payment Providers
                </Typography>
              </Stack>
              <Typography sx={{ color: "text.secondary" }}>
                TechBee ERP offers built-in integrations with major Ethiopian
                banks and payment systems— enabling seamless cash flow
                automation, real-time bank reconciliation, and streamlined
                vendor or payroll payments. No need for costly third-party
                plugins or manual processing.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={3}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                <FlagIcon color="primary" fontSize="large" />
                <Typography variant="h6" fontWeight={600}>
                  Tailored to Ethiopian Regulations
                </Typography>
              </Stack>
              <Typography sx={{ color: "text.secondary" }}>
                Stay compliant with local tax and business laws. TechBee ERP
                includes features for VAT, withholding, and compliance reporting
                aligned with Ethiopian government standards.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={3}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                <LanguageIcon color="primary" fontSize="large" />
                <Typography variant="h6" fontWeight={600}>
                  Multilingual Support
                </Typography>
              </Stack>
              <Typography sx={{ color: "text.secondary" }}>
                Supports Amharic, Afaan Oromo, Tigrigna, and international
                languages. Built for accessibility, inclusivity, and
                productivity across your team.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={3}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                <PublicIcon color="primary" fontSize="large" />
                <Typography variant="h6" fontWeight={600}>
                  Scalable for Growth
                </Typography>
              </Stack>
              <Typography sx={{ color: "text.secondary" }}>
                Whether you're a startup or an enterprise, TechBee ERP scales
                with your needs— from inventory and HR to finance, CRM, and
                reporting—all in one integrated system.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Divider sx={{ my: 6, position: "relative", zIndex: 1 }} />
      <Box
        sx={{
          backgroundColor: "section.main",
          p: 2,
          borderRadius: 2,
        }}
      >
        <Typography
          variant="h5"
          fontWeight={700}
          textAlign="center"
          sx={{
            color: "section.contrastText",
            mb: 2,
            position: "relative",
            zIndex: 1,
          }}
        >
          Ready to modernize your operations?
        </Typography>

        <Typography
          variant="body1"
          textAlign="center"
          sx={{
            color: "section.contrastText",
            mb: 4,
            position: "relative",
            zIndex: 1,
          }}
        >
          TechBee ERP brings clarity, speed, and confidence to every part of
          your business—from the boardroom to the warehouse floor.
        </Typography>
      </Box>
    </Box>
  );
}
