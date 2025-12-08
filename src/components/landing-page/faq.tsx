import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Container,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const faqItems = [
  {
    question: "How does Susa ERP optimize workflow automation?",
    answer:
      "By centralizing your processes, Susa ERP automates repetitive tasks, reduces errors, and accelerates operations across departments effortlessly.",
  },
  {
    question: "Can Susa ERP scale with my growing business?",
    answer:
      "Yes, Susa ERP’s modular architecture ensures seamless scalability — whether you're expanding teams, adding locations, or entering new markets.",
  },
  {
    question: "What deployment options are available for Susa ERP?",
    answer:
      "Choose between secure cloud hosting for instant access or on-premise deployment for maximum control over your data.",
  },
  {
    question: "How user-friendly is the Susa ERP interface?",
    answer:
      "Designed with clarity and simplicity, the intuitive UI enables quick onboarding and minimal training, empowering users at all skill levels.",
  },
  {
    question: "Does Susa ERP support mobile access?",
    answer:
      "Absolutely. Access your ERP anytime on any device with fully responsive design and mobile-optimized features.",
  },
  {
    question: "What kind of analytics does Susa ERP offer?",
    answer:
      "Gain actionable insights with customizable dashboards, real-time reporting, and AI-driven forecasts to drive smarter decisions.",
  },
];

export default function SusaErpFaq() {
  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        bgcolor: "background.default",
        py: { xs: 10, md: 14 },
        px: { xs: 2, sm: 4 },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          bgcolor: "section.light",
          clipPath:
            "polygon(55% 0, 100% 0, 100% 100%, 40% 100%, 18% 100%, 27% 79%, 42% 38%)",
          zIndex: 0,
        }}
      />

      <Container
        maxWidth="md"
        sx={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <Box
          sx={{
            textAlign: "center",
            px: { xs: 2, sm: 4 },
          }}
        >
          <Typography
            variant="h4"
            component="h2" // semantic fix
            sx={{ fontWeight: 700, mb: 1, color: "text.primary" }}
          >
            TechBee ERP FAQ
          </Typography>

          <Typography variant="body1" color="text.secondary">
            Frequently asked questions to guide you through TechBee ERP's
            capabilities.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            "& .MuiAccordion-root": {
              bgcolor: "background.paper",
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "none",
              "&:hover": {
                borderColor: "primary.main",
              },
            },
            "& .MuiAccordionSummary-root": {
              px: 3,
              py: 2,
              "& .MuiAccordionSummary-expandIconWrapper": {
                color: "primary.main",
              },
            },
            "& .MuiAccordionDetails-root": {
              px: 3,
              py: 2,
              color: "text.secondary",
            },
            "& .MuiTypography-root": {
              fontWeight: 500,
            },
          }}
        >
          {faqItems.map((item, index) => (
            <Accordion key={index} disableGutters>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`faq-${index}-content`}
                id={`faq-${index}-header`}
              >
                <Typography variant="h6" component="h3" fontWeight={600}>
                  {item.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">{item.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
