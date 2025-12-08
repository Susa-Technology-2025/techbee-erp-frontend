"use client";
import React, { useEffect, useState } from "react";
import "./TechBee.css";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import ToggleTheme from "@/theme/toogle-theme";
import {
  AppBar,
  Box,
  Button,
  Link,
  Paper,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Card,
  CardContent,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useDataQuery } from "@/lib/tanstack/useDataQuery";

interface Service {
  name: string;
  icon: string;
  description: string;
  color: string;
  image?: string;
  url?: string;
}
export const SERVICE_DATA: Service[] = [
  {
    name: "TechBee ERP",
    icon: "fa-chart-pie",
    description:
      "Integrated Enterprise Resource Planning system to streamline all core business processes, from finance to supply chain.",
    color: "primary",
  },
  {
    name: "Solutions for Real Estates",
    icon: "fa-building",
    description:
      "Comprehensive software for property management, sales tracking, and client relationship management in the real estate sector.",
    color: "secondary",
  },
  {
    name: "Pharmacy Management System",
    icon: "fa-prescription-bottle-alt",
    description:
      "Robust systems for inventory control, prescription processing, and regulatory compliance for modern pharmacies.",
    color: "primary-light",
  },
  {
    name: "Campus Hub",
    icon: "fa-graduation-cap",
    description:
      "An all-in-one platform designed for educational institutions, integrating student, faculty, and administrative tools.",
    color: "primary",
  },
  {
    name: "Custom Software & Mobile Application Development",
    icon: "fa-laptop-code",
    description:
      "We design and build tailored web and mobile applications for unique business needs.",
    color: "primary",
  },
  {
    name: "AI, Automation & Chatbots",
    icon: "fa-robot",
    description:
      "AI-powered chatbots, automation workflows, and document processing systems.",
    color: "secondary",
  },
  {
    name: "Business & IT Strategy Consulting",
    icon: "fa-chart-line",
    description:
      "Digital transformation roadmaps, assessments, and investment planning.",
    color: "primary-light",
  },
  {
    name: "Cloud Migration & Modernization",
    icon: "fa-cloud-upload-alt",
    description:
      "Migration of applications and workloads with performance and cost optimization.",
    color: "primary",
  },
  {
    name: "Cybersecurity & Threat Defense",
    icon: "fa-shield-alt",
    description:
      "Protection of systems and data through threat monitoring, vulnerability mitigation, and secure architecture.",
    color: "danger",
    image: "images/cyber.jpg",
    url: "https://cyber.techbee.et",
  },
];

const CLIENT_DATA = [
  {
    name: "Minda Buisness Group.",
    logo: "https://mindabg.com/public/admin/assets/images/settings/gVQiQQwtHB.png",
    link: "https://mindabg.com/",
  },
  {
    name: "Beaeka General Buisness",
    logo: "https://www.beaeka.com/wp-content/uploads/2022/08/beaeka-logo-finaghhhgghle-Recovered-2048x749.png",
    link: "https://www.beaeka.com/",
  },

  {
    name: "Ekos Steel Mill Plc",
    logo: "https://www.2merkato.com/images/mtree/listings/m/10986.jpg",
    link: "https://www.2merkato.com/directory/24231-ekos-steel-mill-plc",
  },
];
const FOOTER_QUICK_LINKS = [
  { title: "Home", href: "/#home" },
  { title: "Services", href: "/#services" },
  { title: "About", href: "/#about" },
  { title: "Contact", href: "/#contact" },
];
const FOOTER_SERVICE_LINKS = [
  { title: "TechBee ERP", href: "#" },
  { title: "Solutions for Real Estates", href: "#" },
  { title: "Pharmacy Management Systems", href: "#" },
  { title: "Campus Hubs", href: "#" },
];
const NAV_LINKS = [
  { title: "Home", href: "/#home" },
  { title: "Services", href: "/#services" },
  { title: "About", href: "/#about" },
  { title: "Clients", href: "/#clients" },
  { title: "Contact", href: "/#contact" },
  { title: "Products", href: "/apps" },
];
const MobileNavDrawer = ({
  handleDrawerToggle,
}: {
  handleDrawerToggle: () => void;
}) => (
  <Box
    onClick={handleDrawerToggle}
    sx={{ textAlign: "center", width: 250 }}
    role="presentation"
  >
    <Box sx={{ my: 2 }}>
      <a href="/" className="flex items-center justify-center space-x-2">
        <img
          src="images/TechBee.png"
          alt="TechBee Logo"
          className="w-16 object-cover"
        />
        <Typography
          component={"span"}
          sx={{ color: "text.primary", fontWeight: "800" }}
        >
          TechBee
        </Typography>
      </a>
    </Box>
    <Divider />
    <List>
      {NAV_LINKS.map((link) => (
        <ListItem key={link.title} disablePadding>
          <Link
            href={link.href}
            sx={{
              width: "100%",
              py: 1,
              textDecoration: "none",
              color: "text.primary",
            }}
            onClick={handleDrawerToggle}
          >
            <ListItemText primary={link.title} />
          </Link>
        </ListItem>
      ))}
      <ListItem disablePadding>
        <Link
          href="/dashboard"
          sx={{ width: "100%", py: 1, textDecoration: "none" }}
          onClick={handleDrawerToggle}
        >
          <Button
            variant="contained"
            fullWidth
            sx={{
              bgcolor: "section.main",
              color: "section.contrastText",
              mt: 1,
            }}
          >
            Get Started
          </Button>
        </Link>
      </ListItem>
    </List>
  </Box>
);
export const Navigation = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  return (
    <AppBar
      sx={{ bgcolor: "background.paper" }}
      className="sticky w-full  backdrop-blur-sm shadow-sm z-50  m-0 flex items-center"
    >
      <div className="container m-auto px-4 py-3">
        <div className="flex justify-between items-center h-8">
          {}
          <div className="flex items-center space-x-2 m-0 p-0">
            <a href="/" className="flex items-center space-x-2">
              <img
                src="images/TechBee.svg"
                alt="TechBee Logo"
                className="w-16 m-0 p-0 bee-landing-animation"
              />
              <Typography
                component={"span"}
                sx={{ color: "text.primary", fontWeight: "800" }}
              >
                TechBee
              </Typography>
            </a>
          </div>
          {}
          <div className="hidden md:flex space-x-6">
            {NAV_LINKS.map((link) => (
              <Typography
                component={Link}
                key={link.title}
                href={link.href}
                sx={{
                  textDecoration: "none",
                  color: "text.primary",
                  fontWeight: "700",
                }}
              >
                {link.title}
              </Typography>
            ))}
          </div>
          {}
          <div className="flex gap-1 items-center">
            <ToggleTheme />
            {}
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ color: "text.primary", ml: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            {}
            <div className="md:block">
              <Button
                component={Link}
                variant="contained"
                href="/dashboard"
                sx={{ bgcolor: "section.main", color: "section.contrastText" }}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </div>
      {}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <MobileNavDrawer handleDrawerToggle={handleDrawerToggle} />
      </Drawer>
    </AppBar>
  );
};
const HeroSection = () => {
  return (
    <Box
      sx={{
        bgcolor: "section.main",
        color: "section.contrastText",
        clipPath: "polygon(0 0, 100% 0, 100% 75%, 0 100%)",
        height: "70%",
        m: 0,
        pt: 8,
      }}
      id="home"
    >
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 section-content active">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Transform Your Business with
              <span className="text-secondary"> TechBee</span>
            </h1>
            <p className="text-lg mb-8">
              We provide cutting-edge enterprise and cybersecurity solutions
              that drive growth, efficiency, and innovation for businesses of
              all sizes.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  window.location.href = "#services";
                }}
                className="bg-secondary cursor-pointer  px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
              >
                Explore Solutions
              </button>
              <button
                onClick={() => {
                  window.location.href = "#contact";
                }}
                className="bg-transparent border-2 border-white text-white cursor-pointer px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors"
              >
                Contact Us
              </button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-80 h-80 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center floating">
              <div className="absolute -top-4 -left-4 w-20 h-20 bg-secondary rounded-lg flex items-center justify-center">
                <i className="fas fa-chart-line text-white text-2xl"></i>
              </div>
              <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white rounded-lg flex items-center justify-center">
                <i className="fas fa-cloud text-primary text-2xl"></i>
              </div>
              <div className="text-center p-6">
                <i className="fas fa-laptop-code text-6xl text-white mb-4"></i>
                <h3 className="text-xl font-bold">Digital Transformation</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
};

const ServiceDetailsDialog = ({
  open,
  service,
  onClose,
}: {
  open: boolean;
  service: Service;
  onClose: () => void;
}) => {
  const imageUrl = service?.image || "images/default.jpg";
  const redirectUrl = service?.url || "#";

  const handleImageClick = () => {
    if (redirectUrl && redirectUrl !== "#") {
      window.open(redirectUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth={true}
      PaperProps={{
        sx: {
          borderRadius: 3,
        },
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold">{service?.name} Screenshots</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2  hover:bg-gray-100 rounded-full transition-colors duration-200"
            aria-label="Close"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Clickable Image */}
        <div className="flex justify-center">
          <div
            className={`relative cursor-pointer group overflow-hidden rounded-lg shadow-md ${
              redirectUrl && redirectUrl !== "#"
                ? "hover:shadow-xl transition-all duration-300"
                : ""
            }`}
            onClick={handleImageClick}
          >
            <img src={imageUrl} alt={service?.name || "Service screenshot"} />
            {redirectUrl && redirectUrl !== "#" && (
              <div className="absolute inset-0  transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300  px-3 py-1 rounded-full text-2xl bg-black text-white font-medium">
                  Visit Website
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Service Details */}
        <div className="space-y-4">
          {service?.name && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Service Name
              </h3>
              <p>{service.name}</p>
            </div>
          )}

          {service?.description && (
            <div>
              <h3 className="text-lg font-medium  mb-2">Description</h3>
              <p className=" leading-relaxed">{service.description}</p>
            </div>
          )}

          {service?.url && service.url !== "#" && (
            <div>
              <h3 className="text-lg font-medium  mb-2">Website</h3>
              <a
                href={service.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline transition-colors duration-200 break-all"
              >
                {service.url}
              </a>
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
};

const ServicesSection = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const handleOpen = (service: Service) => {
    setSelectedService(service);
    setOpenDialog(true);
  };
  const handleClose = () => {
    setOpenDialog(false);
    setSelectedService(null);
  };
  return (
    <Box id="services" className="w-[95vw] bg-red py-10  mx-auto " sx={{}}>
      <div className=" mx-auto px-6">
        <div className="text-center mb-16 backdrop-blur-sm">
          <h2 className="text-3xl font-bold text-white mb-4">Our Services</h2>
          <p className="text-lg text-white max-w-2xl mx-auto">
            We offer a comprehensive suite of enterprise solutions designed to
            meet your unique business challenges.
          </p>
        </div>
        {}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
            justifyContent: "start",
          }}
        >
          {SERVICE_DATA.map((service, index) => (
            <Card
              key={index}
              onClick={() => handleOpen(service)}
              sx={{
                width: 320,
                height: 170,
                borderRadius: 3,
                p: 2.5,
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                border: "1px solid",
                borderColor: "divider",
                backgroundColor: "background.paper",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
                  borderColor: "primary.light",
                },
              }}
            >
              {/* Top Row - Icon and Name */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "start",
                  gap: 1,
                  mb: 2,
                }}
              >
                {/* Icon Container */}
                <Box
                  component={"i"}
                  className={`fas ${service.icon}`}
                  sx={{
                    color: "section.main",
                    fontSize: "1.1rem",
                  }}
                />

                {/* Service Name */}
                <Typography
                  variant="h6"
                  component="h3"
                  sx={{
                    color: "text.primary",
                    fontWeight: 600,
                    fontSize: "1.1rem",
                    lineHeight: 1.3,
                    flex: 1,
                  }}
                >
                  {service.name}
                </Typography>
              </Box>

              {/* Description */}
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  lineHeight: 1.5,
                  fontSize: "0.875rem",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {service.description}
              </Typography>
            </Card>
          ))}
        </Box>
      </div>
      <ServiceDetailsDialog
        open={openDialog}
        service={selectedService}
        onClose={handleClose}
      />
    </Box>
  );
};
const AboutSection = () => {
  const features = [
    "Certified Experts",
    "24/7 Support",
    "Custom Solutions",
    "Proven Methodologies",
  ];
  return (
    <Box
      sx={{
        bgcolor: "section.main",
        clipPath: "polygon(0 0, 100% 15%, 100% 100%, 0 85%)",
      }}
      id="about"
      className="about-wavy-b py-20 relative"
    >
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 ">
            <div className="relative">
              <Box
                sx={{ bgcolor: "backgroundSection.main" }}
                className="w-full h-80  rounded-2xl"
              ></Box>
              <Box
                sx={{ bgcolor: "background.paper" }}
                className="absolute -bottom-6 -right-6 w-64 h-64  rounded-2xl shadow-xl"
              ></Box>
            </div>
          </div>
          <div className="md:w-1/2 md:pl-12 ">
            <Paper
              className="p-8 rounded-2xl shadow-xl"
              sx={{ color: "text.primary" }}
            >
              <h2 className="text-3xl font-bold mb-6">
                About{" "}
                <Typography
                  component="span"
                  sx={{
                    color: "section.main",
                    fontSize: "32px",
                    fontWeight: "700",
                  }}
                >
                  TechBee
                </Typography>
              </h2>
              <p className="mb-4">
                Founded in 2024, TechBee Enterprise Solutions has been at the
                forefront of digital transformation, helping businesses leverage
                technology to achieve their strategic goals.
              </p>
              <p className="mb-6">
                Our team of certified experts brings together decades of
                experience across various industries, delivering innovative
                solutions that drive measurable results.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {features.map((feature, index) => (
                  <Box
                    sx={{ color: "section.main" }}
                    key={index}
                    className="flex items-center"
                  >
                    <i className="fas fa-check-circle  mr-2"></i>
                    <Typography sx={{ color: "text.primary" }}>
                      {feature}
                    </Typography>
                  </Box>
                ))}
              </div>
              <Button
                sx={{ bgcolor: "section.main", color: "section.contrastText" }}
              >
                Learn More About Us
              </Button>
            </Paper>
          </div>
        </div>
      </div>
    </Box>
  );
};
const ClientsSection = () => {
  return (
    <Box
      id="clients"
      sx={{
        bgcolor: "backgroundSection.main",
      }}
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 p-6">
          <Typography
            component={"h2"}
            className="backdrop-filter-xs"
            sx={{
              fontSize: "32px",
              fontWeight: "700",
            }}
          >
            Our Clients
          </Typography>
          <Typography component={"p"} className="text-lg max-w-2xl mx-auto">
            We're proud to partner with industry leaders and innovative startups
            across various sectors.
          </Typography>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 justify-center">
          {CLIENT_DATA.map((company, index) => (
            <a
              key={index}
              href={company.link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white backdrop-blur-xl h-28 rounded-xl flex flex-col items-center justify-center p-4 hover:bg-white/20 transition-all duration-300 group"
            >
              <img
                style={{ height: "200px", overflow: "hidden" }}
                src={company.logo}
              />
            </a>
          ))}
        </div>
        <Box
          sx={{
            color: "backgroundSection.contrastText",
            bgcolor: "backgroundSection.main",
          }}
          className=" backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto"
        >
          <div className="flex items-start">
            <div className="mr-4 text-4xl">"</div>
            <div>
              <p className="text-lg mb-4">
                "In my entire career, I have never encountered an ERP system as
                intuitive and effective as this one. Everything is
                straightforward, easy to use, and built with real-world business
                challenges in mind. It is a powerful and practical platform that
                truly simplifies complex processes."
              </p>
              <Box className="flex items-center">
                <Box
                  sx={{ bgcolor: "section.main" }}
                  className="w-12 h-12  rounded-lg mr-4"
                ></Box>
                <div>
                  <h4 className="font-bold">Yetimgeta</h4>
                  <p>HR | Minda Business Group</p>
                </div>
              </Box>
            </div>
          </div>
        </Box>
      </div>
    </Box>
  );
};
const ContactSection = () => {
  const services = SERVICE_DATA.map((s) => s.name);
  return (
    <Box
      sx={{
        position: "relative",
        py: 4,
        mb: 2,
        color: "section.contrastText",
      }}
      id="contact"
    >
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 section-content">
            <h2 className="text-3xl font-bold mb-4">Get In Touch</h2>
            <p className="text-lg">
              Ready to transform your business? Contact us today for a free
              consultation.
            </p>
          </div>
          <Box
            sx={{
              bgcolor: "section.main",
              position: "relative",
              p: 4,
              color: "section.contrastText",
              mb: 2,
            }}
            className="rounded-xl"
          >
            {" "}
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white mb-2" htmlFor="name">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label className="block text-white mb-2" htmlFor="email">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label className="block text-white mb-2" htmlFor="company">
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder="Your Company"
                />
              </div>
              <div>
                <label className="block text-white mb-2" htmlFor="service">
                  Service Interest
                </label>
                <select
                  id="service"
                  className="w-full px-4 py-3 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  {services.map((service, index) => (
                    <option className="bg-black" key={index}>
                      {service}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-white mb-2" htmlFor="message">
                  Message
                </label>
                <textarea
                  id="message"
                  rows="4"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder="Tell us about your project..."
                ></textarea>
              </div>
              <div className="md:col-span-2 text-center">
                <button
                  type="submit"
                  className="bg-secondary text-dark px-8 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
                >
                  Send Message
                </button>
              </div>
            </form>
          </Box>
        </div>
      </div>
    </Box>
  );
};
const Footer = () => {
  return (
    <Box
      component={"footer"}
      sx={{ bgcolor: "background.main", color: "section.contrastText" }}
      className="text-white py-12 backdrop-blur-2xl"
    >
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full  flex items-center justify-center">
                <i className="fas fa-bug text-white text-lg"></i>
              </div>
              <span className="ml-2 text-xl font-bold">TechBee</span>
            </div>
            <p className="">
              Empowering businesses through innovative technology solutions
              since 2024.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {FOOTER_QUICK_LINKS.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="hover:text-gray-400 transition-colors"
                  >
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Services</h3>
            <ul className="space-y-2">
              {FOOTER_SERVICE_LINKS.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="hover:text-gray-400 transition-colors"
                  >
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Info</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <i className="fas fa-map-marker-alt mr-2"></i>
                <span className="font-bolder">
                  3rd Floor, Elilta RealEstate, Sarbet Addis ababa, Ethiopia
                </span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-phone  mr-2"></i>
                <span className="font-bolder">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-envelope  mr-2"></i>
                <span className="font-bolder">info@techbee.com</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 TechBee Enterprise Solutions. All rights reserved.</p>
        </div>
      </div>
    </Box>
  );
};
export const BackgroundSection = () => {
  const [activeBg, setActiveBg] = useState(0);
  const [bgImage, setBgImage] = useState(
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80"
  );
  const { data, isLoading, isSuccess } = useDataQuery({
    apiEndPoint: "https://api.techbee.et/api/core/landingPages?where[code]=erp",
    tenantCode: "erp",
    fetchWithoutRefresh: true,
    noFilter: true,
  });
  console.log(bgImage);
  useEffect(() => {
    if (isSuccess) {
      if (Array.isArray(data?.data) && data?.data[0]?.backgroundImage) {
        setBgImage(data.data[0]?.backgroundImage);
      }
    }
  }, [isSuccess, data]);
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section");
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          setActiveBg(index);
        }
      });
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div
      style={{
        backgroundImage: `url("${bgImage}")`,
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        zIndex: -2,
        opacity: 1,
        transition: "opacity 1.2s ease",
      }}
    ></div>
  );
};
export const TechBeeLandingPage = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".section-content").forEach((el) => {
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);
  return (
    <div
      className="font-inter h-screen overflow-auto"
      style={{ scrollbarWidth: "none" }}
    >
      <BackgroundSection />
      <Navigation />
      <HeroSection />
      <div className="gap-filler"></div>
      <ServicesSection />
      <div className="gap-filler"></div>
      <AboutSection />
      <div className="gap-filler"></div>
      <ClientsSection />
      <div className="gap-filler"></div>
      <ContactSection />
      <Footer />
    </div>
  );
};
