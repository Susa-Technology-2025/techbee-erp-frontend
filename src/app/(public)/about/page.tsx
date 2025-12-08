import {
  Box,
  Typography,
  Divider,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  Avatar,
  Chip,
} from "@mui/material";
import {
  GroupWork,
  Visibility,
  Flag,
  Expand,
  CheckCircle,
} from "@mui/icons-material";

export default () => {
  const sections = [
    {
      title: "Founded By",
      content:
        "TechBee Enterprise Solutions was founded by a team of experienced professionals with deep expertise in enterprise resource planning, software development, and business management. The founders sought to bridge the gap between local businesses and global ERP standards by creating a tailored solution that understands the unique challenges faced by Ethiopian businesses.",
      icon: <GroupWork color="primary" fontSize="large" />,
    },
    {
      title: "Vision",
      content:
        "To become a leading provider of innovative, scalable, and reliable ERP solutions for businesses in Ethiopia and beyond, empowering organizations to streamline their operations, enhance decision-making, and foster sustainable growth.",
      icon: <Visibility color="primary" fontSize="large" />,
    },
    {
      title: "Mission",
      content:
        "Our mission is to deliver high-quality, customizable ERP systems that enable businesses to effectively manage their resources, improve efficiency, and drive growth. By leveraging modern technologies and best practices, we strive to provide user-friendly, comprehensive solutions that meet the diverse needs of industries such as manufacturing, retail, logistics, and more.",
      icon: <Flag color="primary" fontSize="large" />,
    },
    {
      title: "Future Plans",
      content:
        "Expand within Ethiopia and beyond, engage with government officials, collaborate with financial institutions, and scale globally.",
      icon: <Expand color="primary" fontSize="large" />,
    },
  ];

  const coreValues = [
    "Innovation",
    "Customer-Centricity",
    "Integrity",
    "Collaboration",
  ];

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 6, md: 10 },
        px: { xs: 2, md: 6 },
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
          clipPath:
            "polygon(64% 8%, 100% 0, 100% 100%, 78% 100%, 60% 93%, 29% 100%, 0 100%, 0 0, 38% 0)",
        }}
      >
        <path
          fill="currentColor"
          fillOpacity="0.08"
          d="M0,128L60,144C120,160,240,192,360,192C480,192,600,160,720,138.7C840,117,960,107,1080,128C1200,149,1320,203,1380,229.3L1440,256L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
        />
      </Box>
      <Box textAlign="center" mb={8} sx={{ color: "text.primary" }}>
        <Typography
          variant="h3"
          fontWeight={700}
          gutterBottom
          sx={{
            // color: "section.contrastText",
            fontSize: { xs: "2rem", md: "3rem" },
          }}
        >
          About <Box component="span">TechBee Enterprise Solutions</Box>
        </Typography>
        <Typography
          variant="subtitle1"
          // color="section.contrastText"
          maxWidth="800px"
          mx="auto"
        >
          Empowering businesses through innovative ERP solutions tailored for
          the Ethiopian market
        </Typography>
      </Box>

      <Divider
        sx={{
          my: 6,
          mx: "auto",
          maxWidth: 200,
          backgroundColor: "divider",
        }}
      />

      <Grid container spacing={4} justifyContent="center">
        {sections.map((section) => (
          <Grid size={{ xs: 12, md: 6, lg: 5 }} key={section.title}>
            <Card
              elevation={3}
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  {section.icon}
                  <Typography
                    variant="h6"
                    component="h3"
                    ml={2}
                    fontWeight={600}
                    color="text.primary"
                  >
                    {section.title}
                  </Typography>
                </Box>
                <Typography color="text.secondary">
                  {section.content}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box
        mt={8}
        maxWidth="800px"
        mx="auto"
        sx={{ backgroundColor: "section.main", borderRadius: 2, p: 1 }}
      >
        <Typography
          variant="h5"
          textAlign="center"
          mb={4}
          fontWeight={600}
          color="section.contrastText"
        >
          Our Core Values
        </Typography>

        <Box
          sx={{
            display: {
              xs: "block",
              md: "none",
            },
          }}
        >
          <Grid container spacing={2} justifyContent="center">
            {coreValues.map((value) => (
              <Grid size={{ xs: 6, sm: 3 }} key={value}>
                <Card elevation={0} sx={{ textAlign: "center", p: 2 }}>
                  <CheckCircle sx={{ textAlign: "center" }} fontSize="medium" />
                  <Typography mt={1} color="section.contrastText">
                    {value}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ display: { xs: "none", md: "block" } }}>
          <List
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 0,
            }}
          >
            {coreValues.map((value, index) => (
              <Box
                key={value}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  position: "relative",
                  flex: 1,
                }}
              >
                <ListItem sx={{ flexDirection: "column", padding: 0 }}>
                  <ListItemIcon sx={{ minWidth: "auto", mb: 1 }}>
                    <Avatar sx={{ bgcolor: "primary.main" }}>
                      <CheckCircle sx={{ color: "white" }} />
                    </Avatar>
                  </ListItemIcon>
                  <Typography variant="h6" color="section.contrastText">
                    {value}
                  </Typography>
                </ListItem>
                {index < coreValues.length - 1 && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: "50%",
                      right: "-50%",
                      width: "100%",
                      height: "2px",
                      bgcolor: "divider",
                      zIndex: -1,
                    }}
                  />
                )}
              </Box>
            ))}
          </List>
        </Box>
      </Box>
    </Box>
  );
};
