import React from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Card,
  CardHeader,
  Divider,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";

const ContactUs = () => {
  return (
    <Box
      component="section"
      sx={{
        bgcolor: "section.main",
        color: "section.contrastText",
        py: { xs: 8, md: 12 },
        px: { xs: 3, md: 8 },
        borderTopRightRadius: { xs: "80px", md: "160px" },
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        boxShadow: "0 12px 32px rgba(25, 118, 210, 0.3)",
        position: "relative",
        left: { xs: 0, md: "-20px" },
        boxSizing: "border-box",
      }}
    >
      <Typography
        variant="h3"
        fontWeight={700}
        align="center"
        sx={{ mb: 3, color: "section.contrastText" }}
      >
        Contact Us
      </Typography>

      <Typography
        variant="body1"
        align="center"
        sx={{
          maxWidth: 700,
          mx: "auto",
          mb: 8,
          color: "section.contrastText",
        }}
      >
        We'd love to hear from you! Whether you're curious about features, need
        a demo, or want to become a partner — we’re ready to answer any and all
        questions.
      </Typography>

      <Grid container spacing={{ xs: 5, md: 8 }} justifyContent="center">
        <Grid size={{ xs: 12, md: 5 }}>
          <Card
            elevation={6}
            sx={{
              borderRadius: "32px",
              bgcolor: "section.main",
              color: "section.contrastText",
              px: 4,
              py: 5,
              boxShadow: "0 8px 28px rgba(91, 192, 235, 0.7)",
            }}
          >
            <CardHeader
              title="Our Address"
              sx={{
                px: 0,
                mb: 4,
                "& .MuiCardHeader-title": {
                  fontWeight: 700,
                  fontSize: "1.4rem",
                  color: "section.contrastText",
                },
              }}
            />
            <Box sx={{ display: "flex", mb: 4 }}>
              <LocationOnIcon
                sx={{
                  mr: 3,
                  mt: 0.5,
                  fontSize: 28,
                }}
              />
              <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                TechBee Enterprise Solutions.
                <br />
                3rd Floor, Elilta Real Estate,
                <br />
                Sarbet, Addis Ababa, Ethiopia
              </Typography>
            </Box>

            <Divider sx={{ borderColor: "section.light", mb: 4 }} />

            <Box sx={{ display: "flex" }}>
              <EmailIcon
                sx={{
                  mr: 3,
                  mt: 0.5,
                  fontSize: 28,
                }}
              />
              <Typography variant="body1">contact@techbee.com</Typography>
            </Box>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Card
            elevation={6}
            sx={{
              borderRadius: "32px",
              px: 4,
              py: 5,
            }}
          >
            <CardHeader
              title="Send Us a Message"
              sx={{
                px: 0,
                mb: 4,
                "& .MuiCardHeader-title": {
                  fontWeight: 700,
                  fontSize: "1.4rem",
                },
              }}
            />
            <Box component="form" noValidate sx={{ width: "100%" }}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Your Name"
                    fullWidth
                    required
                    variant="outlined"
                    sx={{
                      bgcolor: "background.paper",
                      borderRadius: 2,
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Email Address"
                    fullWidth
                    required
                    type="email"
                    variant="outlined"
                    sx={{
                      bgcolor: "background.paper",
                      borderRadius: 2,
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="Message"
                    fullWidth
                    required
                    multiline
                    rows={5}
                    variant="outlined"
                    sx={{
                      bgcolor: "background.paper",
                      borderRadius: 2,
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    sx={{
                      textTransform: "none",
                      borderRadius: "40px",
                      fontWeight: 700,
                      fontSize: "1.1rem",
                      py: 1.6,
                    }}
                  >
                    Send Message
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ContactUs;
