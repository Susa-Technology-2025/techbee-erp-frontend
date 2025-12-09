import ContactUs from "@/components/landing-page/contact-us";
import Footer from "@/components/landing-page/footer";
import VideoSection from "@/components/landing-page/video-section";
import SusaErpFaq from "@/components/landing-page/faq";
import { Box } from "@mui/material";
import DynamicLandingPage from "@/app/(public)/_components/landing";
import SusaErpStats from "@/components/landing-page/stats-section";

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
      <SusaErpStats />

      <VideoSection />
      <SusaErpFaq />
      <ContactUs />
      <Footer />
    </Box>
  );
}
