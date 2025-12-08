import {
  Box,
  Typography,
  Stack,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  Link,
  Grid,
  Container,
} from "@mui/material";
import {
  RocketLaunch,
  GroupAdd,
  Login,
  Dashboard,
  Inventory,
  Receipt,
  People,
  Star,
} from "@mui/icons-material";

export default () => {
  return (
    <Box
      component={Container}
      sx={{
        mx: "auto",
        px: { xs: 2, md: 4 },
        py: 6,
        zindex: 1,
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
          zIndex: -1,
          backgroundColor: "section.main",
          clipPath: "polygon(0 0, 100% 0, 100% 80%, 75% 100%, 25% 90%, 0 100%)",
        }}
      >
        <path
          fill="currentColor"
          fillOpacity="0.08"
          d="M0,128L60,144C120,160,240,192,360,192C480,192,600,160,720,138.7C840,117,960,107,1080,128C1200,149,1320,203,1380,229.3L1440,256L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
        />
      </Box>

      <Box
        textAlign="center"
        mb={4}
        // sx={{ backgroundColor: "background.paper", p: 2, borderRadius: 2 }}
      >
        <Typography
          variant="h2"
          fontWeight={800}
          gutterBottom
          sx={{
            color: "section.contrastText",
            fontSize: { xs: "2rem", md: "3rem" },
          }}
        >
          Get Started with TechBee ERP
        </Typography>
        <Typography variant="h5" color="section.contrastText">
          Transform your business operations in just 3 simple steps
        </Typography>
      </Box>

      <Box>
        <Box
          sx={{ backgroundColor: "background.paper", p: 2, borderRadius: 2 }}
        >
          <Typography variant="h5" fontWeight={600} gutterBottom>
            1️⃣ Register Your Organization
          </Typography>
          <Typography color="text.secondary">
            You can start with our <strong>free trial</strong>
          </Typography>

          <List dense sx={{ mb: 1 }}>
            <ListItem>
              <ListItemIcon>
                <Star color="primary" />
              </ListItemIcon>
              Register by providing basic organization details (name, industry,
              admin email)
            </ListItem>
          </List>

          <Button
            component={Link}
            variant="contained"
            size="large"
            href="/auth"
            startIcon={<RocketLaunch />}
            sx={{ px: 4 }}
          >
            Register Organization
          </Button>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box
          sx={{ backgroundColor: "background.paper", p: 2, borderRadius: 2 }}
        >
          <Typography variant="h5" fontWeight={600} gutterBottom>
            2️⃣ Invite Your Team Members
          </Typography>
          <Typography color="text.secondary">
            After organization registration, you'll receive a unique{" "}
            <strong>Organization ID</strong>
          </Typography>

          <List dense sx={{ mb: 1 }}>
            <ListItem>
              <ListItemIcon>
                <Star color="primary" />
              </ListItemIcon>
              Share this ID with your team
            </ListItem>
          </List>

          <Button
            component={Link}
            variant="contained"
            size="large"
            href="/auth"
            startIcon={<GroupAdd />}
            sx={{ px: 4 }}
          >
            Register User
          </Button>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box
          sx={{ backgroundColor: "background.paper", p: 2, borderRadius: 2 }}
        >
          <Typography variant="h5" fontWeight={600} gutterBottom>
            3️⃣ Log In & Explore Features
          </Typography>
          <Typography color="text.secondary">
            Access powerful tools to streamline your business operations
          </Typography>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Dashboard color="primary" />
                  </ListItemIcon>
                  Real-time business dashboard
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Receipt color="primary" />
                  </ListItemIcon>
                  Automated invoicing & accounting
                </ListItem>
              </List>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Inventory color="primary" />
                  </ListItemIcon>
                  Inventory management
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <People color="primary" />
                  </ListItemIcon>
                  HR & payroll system
                </ListItem>
              </List>
            </Grid>
          </Grid>

          <Button
            component={Link}
            variant="contained"
            size="large"
            href="/auth"
            startIcon={<Login />}
            sx={{ px: 4, bgcolor: "success.main" }}
          >
            Login
          </Button>
        </Box>
      </Box>

      <Box
        textAlign="center"
        mt={8}
        sx={{ backgroundColor: "section.main", p: 2, borderRadius: 2 }}
      >
        <Typography color="section.contrastText" variant="h5" gutterBottom>
          Ready to revolutionize your business management?
        </Typography>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="center"
        >
          <Button
            component={Link}
            variant="contained"
            size="large"
            href="/auth"
            sx={{ px: 6 }}
          >
            Start Free Trial
          </Button>
          <Button
            component={Link}
            variant="outlined"
            size="large"
            href="/demo"
            sx={{ px: 6, color: "section.contrastText" }}
          >
            Request Demo
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};
