"use client"
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Button,
  Card,
  CardHeader,
  CardContent,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  useTheme,
  Divider,
  Chip,
  Avatar,
  Tabs,
  Tab,
  alpha,
  InputAdornment,
  Container,
  Paper,
  Stack,
  Fab
} from "@mui/material";
import {
  Menu as MenuIcon,
  Home,
  Person,
  ShoppingCart,
  Inventory,
  Receipt,
  BarChart,
  Settings,
  Help,
  ExpandMore,
  Rocket,
  QuestionAnswer,
  Star,
  VideoLibrary,
  Book,
  PictureAsPdf,
  Headset,
  CheckCircle,
  Search,
  TrendingUp,
  Download,
  ContactSupport,
  Lightbulb,
  Article,
  Close,
  KeyboardArrowRight,
  ChevronLeft
} from "@mui/icons-material";

const navItems = [
  { label: "Getting Started", icon: <Home />, color: "#4f46e5" },
  { label: "User Management", icon: <Person />, color: "#ec4899" },
  { label: "Sales Module", icon: <ShoppingCart />, color: "#f59e0b" },
  { label: "Inventory", icon: <Inventory />, color: "#10b981" },
  { label: "Accounting", icon: <Receipt />, color: "#8b5cf6" },
  { label: "Reporting", icon: <BarChart />, color: "#3b82f6" },
  { label: "System Settings", icon: <Settings />, color: "#6366f1" },
  { label: "FAQs & Support", icon: <Help />, color: "#ef4444" },
];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const ERPDocumentation: React.FC = () => {
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Getting Started");
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const drawerContent = (
    <Box
      sx={{
        width: 300,
        bgcolor: "#1e293b",
        color: "white",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.03))'
      }}
    >
      <Box
        sx={{
          p: 3,
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <Avatar 
          sx={{ 
            bgcolor: theme.palette.secondary.main, 
            width: 56, 
            height: 56, 
            mb: 2,
            fontSize: '1.5rem',
            fontWeight: 'bold'
          }}
        >
          ERP
        </Avatar>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          ERP Documentation
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.7 }}>
          Complete guide to using your system
        </Typography>
      </Box>

      <Box sx={{ p: 2 }}>
        <TextField
          placeholder="Search documentation..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          variant="outlined"
          size="small"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: "rgba(255,255,255,0.5)" }} />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton 
                  size="small" 
                  onClick={() => setSearchQuery("")}
                  sx={{ color: "rgba(255,255,255,0.5)" }}
                >
                  <Close fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
            sx: {
              borderRadius: "10px",
              bgcolor: "rgba(255,255,255,0.07)",
              color: "white",
              "& fieldset": { border: "none" },
              "& input::placeholder": { color: "rgba(255,255,255,0.5)" },
            },
          }}
        />
      </Box>

      <List sx={{ flexGrow: 1, px: 1 }}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.label}
            selected={activeItem === item.label}
            onClick={() => setActiveItem(item.label)}
            sx={{
              borderRadius: "10px",
              mx: 0.5,
              my: 0.5,
              "&.Mui-selected": {
                bgcolor: "rgba(255,255,255,0.12)",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.15)",
                }
              },
              "&:hover": { 
                bgcolor: "rgba(255,255,255,0.07)",
              },
            }}
          >
            <ListItemIcon sx={{ 
              color: activeItem === item.label ? item.color : "rgba(255,255,255,0.7)",
              minWidth: '40px'
            }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.label} 
              primaryTypographyProps={{
                fontSize: '0.95rem',
                fontWeight: activeItem === item.label ? 600 : 400
              }}
            />
            {activeItem === item.label && <KeyboardArrowRight sx={{ opacity: 0.7 }} />}
          </ListItemButton>
        ))}
      </List>

      <Box sx={{ p: 2.5, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<ContactSupport />}
          sx={{
            borderRadius: 2,
            py: 1,
            textTransform: 'none',
            fontWeight: 600,
            bgcolor: theme.palette.secondary.main,
            "&:hover": {
              bgcolor: alpha(theme.palette.secondary.main, 0.9)
            }
          }}
        >
          Contact Support
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", bgcolor: "#f8fafc", minHeight: "100vh" }}>
      {/* Sidebar for desktop */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": { 
            position: "relative", 
            width: 300, 
            border: "none",
            boxShadow: "0 0 20px rgba(0,0,0,0.07)"
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>

      {/* Sidebar for mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { 
            width: 300, 
            border: "none",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
        {/* Top bar for mobile */}
        <AppBar
          position="static"
          elevation={0}
          sx={{
            mb: 2,
            display: { md: "none" },
            bgcolor: "white",
            color: theme.palette.text.primary,
            borderRadius: 2,
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)"
          }}
        >
          <Toolbar>
            <IconButton 
              color="inherit" 
              edge="start" 
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Documentation
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Breadcrumb & Actions */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            mb: 3,
            flexWrap: "wrap",
            gap: 2,
            flexDirection: { xs: "column", sm: "row" }
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              {activeItem}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", flexWrap: 'wrap' }}>
              <Typography color="text.secondary" variant="body2">
                Home
              </Typography>
              <ChevronLeft sx={{ color: 'text.secondary', fontSize: 18, mx: 0.5 }} />
              <Typography color="text.secondary" variant="body2">
                {activeItem}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 1, flexWrap: 'wrap' }}>
            <Button 
              variant="outlined" 
              startIcon={<PictureAsPdf />} 
              sx={{ borderRadius: 2, textTransform: 'none' }}
            >
              Export PDF
            </Button>
            <Button 
              variant="contained" 
              startIcon={<Headset />} 
              sx={{ borderRadius: 2, textTransform: 'none' }}
            >
              Get Help
            </Button>
          </Box>
        </Box>

        {/* Content Tabs */}
        <Paper 
          elevation={0} 
          sx={{ 
            mb: 3, 
            borderRadius: 2,
            bgcolor: 'white',
            overflow: 'hidden'
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              px: 2,
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500,
                minHeight: 60
              }
            }}
          >
            <Tab icon={<Rocket />} iconPosition="start" label="Getting Started" />
            <Tab icon={<Article />} iconPosition="start" label="Guides" />
            <Tab icon={<VideoLibrary />} iconPosition="start" label="Video Tutorials" />
            <Tab icon={<QuestionAnswer />} iconPosition="start" label="FAQs" />
          </Tabs>

          {/* Getting Started Panel */}
          <TabPanel value={tabValue} index={0}>
            <Stack spacing={3}>
              <Typography variant="h5" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Rocket color="primary" /> Welcome to Your ERP System
              </Typography>
              <Typography color="text.secondary" paragraph>
                Get up and running quickly with our comprehensive setup guides and tutorials designed 
                to help you maximize productivity from day one.
              </Typography>
              
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
                {[
                  {
                    title: "First Steps",
                    icon: <TrendingUp color="primary" />,
                    items: [
                      "System Requirements",
                      "User Account Setup",
                      "Basic Navigation",
                      "Dashboard Overview",
                    ],
                  },
                  {
                    title: "Key Features",
                    icon: <Star color="primary" />,
                    items: [
                      "Real-time Inventory",
                      "Sales Tracking",
                      "Financial Reports",
                      "Multi-user Access",
                    ],
                  },
                  {
                    title: "Learning Resources",
                    icon: <Book color="primary" />,
                    items: ["Video Tutorials", "User Manual", "Cheat Sheets", "Webinars"],
                  },
                ].map((card, i) => (
                  <Card
                    key={i}
                    sx={{
                      flex: "1 1 300px",
                      borderRadius: 3,
                      transition: "0.3s",
                      border: "1px solid",
                      borderColor: "divider",
                      "&:hover": { 
                        transform: "translateY(-4px)", 
                        boxShadow: "0 12px 30px rgba(0,0,0,0.08)" 
                      },
                    }}
                  >
                    <CardHeader
                      title={
                        <Box display="flex" alignItems="center" gap={1}>
                          {card.icon}
                          <Typography variant="h6" fontWeight={600}>
                            {card.title}
                          </Typography>
                        </Box>
                      }
                      sx={{ 
                        pb: 1,
                        borderBottom: "1px solid",
                        borderColor: "divider"
                      }}
                    />
                    <CardContent>
                      {card.items.map((item, index) => (
                        <Typography 
                          key={index} 
                          sx={{ 
                            display: "flex", 
                            alignItems: "center", 
                            gap: 1, 
                            mb: 1.5,
                            fontSize: '0.95rem'
                          }}
                        >
                          <CheckCircle color="success" fontSize="small" /> {item}
                        </Typography>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Stack>
          </TabPanel>

          {/* Guides Panel */}
          <TabPanel value={tabValue} index={1}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
              Step-by-Step Guides
            </Typography>
            <Stack spacing={2}>
              {[1, 2, 3].map((item) => (
                <Paper 
                  key={item} 
                  variant="outlined" 
                  sx={{ 
                    p: 2.5, 
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    transition: '0.2s',
                    '&:hover': {
                      bgcolor: 'action.hover',
                      cursor: 'pointer'
                    }
                  }}
                >
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <Article />
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" fontWeight={500}>
                      How to {item === 1 ? 'Set Up User Permissions' : item === 2 ? 'Generate Financial Reports' : 'Manage Inventory'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item === 1 
                        ? 'Learn how to configure user roles and permissions in your system' 
                        : item === 2 
                        ? 'Step-by-step instructions for generating and customizing financial reports'
                        : 'Complete guide to managing your inventory efficiently'
                      }
                    </Typography>
                  </Box>
                  <Chip 
                    label={item === 1 ? '15 min' : item === 2 ? '20 min' : '25 min'} 
                    size="small" 
                    variant="outlined" 
                  />
                </Paper>
              ))}
            </Stack>
          </TabPanel>

          {/* Video Tutorials Panel */}
          <TabPanel value={tabValue} index={2}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
              Video Tutorials
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              {[1, 2, 3, 4].map((item) => (
                <Card
                  key={item}
                  sx={{
                    flex: "1 1 280px",
                    borderRadius: 3,
                    overflow: "hidden",
                    transition: "0.3s",
                    "&:hover": { 
                      transform: "translateY(-4px)", 
                      boxShadow: "0 12px 30px rgba(0,0,0,0.08)" 
                    },
                  }}
                >
                  <Box
                    sx={{
                      height: 160,
                      bgcolor: "grey.200",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "text.secondary"
                    }}
                  >
                    <VideoLibrary sx={{ fontSize: 48 }} />
                  </Box>
                  <CardContent>
                    <Typography variant="h6" fontWeight={500} gutterBottom>
                      {item === 1 
                        ? 'Dashboard Overview' 
                        : item === 2 
                        ? 'Creating Sales Invoices'
                        : item === 3
                        ? 'Inventory Management'
                        : 'Financial Reporting'
                      }
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item === 1 
                        ? 'Learn how to navigate and customize your dashboard' 
                        : item === 2 
                        ? 'Step-by-step guide to creating and managing invoices'
                        : item === 3
                        ? 'How to efficiently manage your inventory'
                        : 'Generating and interpreting financial reports'
                      }
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                      <Chip 
                        label={item === 1 ? '8:15' : item === 2 ? '12:40' : item === 3 ? '15:20' : '10:30'} 
                        size="small" 
                        variant="outlined" 
                      />
                      <Button size="small" endIcon={<Download />}>
                        Download
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </TabPanel>

          {/* FAQs Panel */}
          <TabPanel value={tabValue} index={3}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <QuestionAnswer color="primary" /> Frequently Asked Questions
            </Typography>
            <Stack spacing={2}>
              {[
                {
                  q: "How do I reset my password?",
                  a: "Click on 'Forgot Password' on the login page and follow the instructions sent to your email.",
                },
                {
                  q: "Can I customize reports?",
                  a: "Yes, navigate to Reporting module, select a report, and click 'Customize' to tailor it to your needs.",
                },
                {
                  q: "How do I update my company information?",
                  a: "Go to Settings → Company Profile to update details, logo, and contact information. Changes will be reflected across all modules.",
                },
                {
                  q: "Is multi-currency support available?",
                  a: "Yes, our system supports multiple currencies. You can configure this in Settings → Financial → Currencies.",
                },
              ].map((faq, i) => (
                <Paper 
                  key={i} 
                  variant="outlined" 
                  sx={{ 
                    borderRadius: 2,
                    overflow: 'hidden'
                  }}
                >
                  <Accordion 
                    sx={{ 
                      boxShadow: "none",
                      '&:before': { display: 'none' }
                    }}
                  >
                    <AccordionSummary 
                      expandIcon={<ExpandMore />}
                      sx={{ 
                        fontWeight: 500,
                        bgcolor: i % 2 === 0 ? 'grey.50' : 'transparent'
                      }}
                    >
                      {faq.q}
                    </AccordionSummary>
                    <AccordionDetails sx={{ 
                      borderTop: '1px solid',
                      borderColor: 'divider',
                      bgcolor: i % 2 === 0 ? 'grey.50' : 'transparent'
                    }}>
                      {faq.a}
                    </AccordionDetails>
                  </Accordion>
                </Paper>
              ))}
            </Stack>
          </TabPanel>
        </Paper>

        {/* Feedback Section */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            borderRadius: 3,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            backgroundImage: 'linear-gradient(75deg, #4f46e5, #7c73e6)'
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 3 }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                Was this helpful?
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Let us know how we can improve this documentation
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
              <Button 
                variant="contained" 
                color="secondary" 
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none'
                }}
              >
                Yes, thanks
              </Button>
              <Button 
                variant="outlined" 
                sx={{ 
                  borderRadius: 2,
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: 'white',
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: 'white'
                  }
                }}
              >
                Not really
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Floating Action Button for mobile */}
      <Fab
        color="primary"
        aria-label="support"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          display: { xs: 'flex', md: 'none' }
        }}
      >
        <Headset />
      </Fab>
    </Box>
  );
};

export default ERPDocumentation;