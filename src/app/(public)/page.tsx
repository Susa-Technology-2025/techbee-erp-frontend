import ScrollAnimationWrapper from "@/components/landing-page/section-wrapper";
import ContactUs from "@/components/landing-page/contact-us";
import Footer from "@/components/landing-page/footer";
import VideoSection from "@/components/landing-page/video-section";
import SusaErpFaq from "@/components/landing-page/faq";
import SusaErpStats from "@/components/landing-page/stats-section";
import { Variants } from "framer-motion";
import { Box } from "@mui/material";
import DynamicLandingPage from "@/app/(public)/_components/landing";

const fadeUpVariants: Variants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

const scaleRotateVariants: Variants = {
  initial: { opacity: 0, scale: 0.9, rotate: -5 },
  animate: { opacity: 1, scale: 1, rotate: 0 },
};

export default function Page() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        m: 0,
        p: 0,
        backgroundColor: "background.paper",
      }}
    >
      <DynamicLandingPage />
      <ScrollAnimationWrapper variants={fadeUpVariants}>
        <SusaErpStats />
      </ScrollAnimationWrapper>
      <ScrollAnimationWrapper variants={scaleRotateVariants}>
        <VideoSection />
      </ScrollAnimationWrapper>
      <ScrollAnimationWrapper variants={fadeUpVariants}>
        <SusaErpFaq />
      </ScrollAnimationWrapper>
      <ScrollAnimationWrapper variants={scaleRotateVariants}>
        <ContactUs />
      </ScrollAnimationWrapper>
      <ScrollAnimationWrapper variants={fadeUpVariants}>
        <Footer />
      </ScrollAnimationWrapper>
    </Box>
  );
}
