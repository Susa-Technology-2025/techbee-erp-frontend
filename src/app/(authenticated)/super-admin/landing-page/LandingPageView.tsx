import { Announcements } from "@/app/(public)/_components/announcement";
import { Hero } from "@/app/(public)/_components/hero";
import { Insights } from "@/app/(public)/_components/insights";
import { Tutorials } from "@/app/(public)/_components/tutorials";
import { ResponsiveNavigation } from "@/components/public-navbar";
import { Typography } from "@mui/material";

export function LandingPageView({
  data,
  loading,
}: {
  data: any;
  loading: boolean;
}) {
  if (loading) return <Typography>Loading Landing Page Data...</Typography>;
  if (!data)
    return (
      <Typography>
        No client data available to display the Preview Button.
      </Typography>
    );

  return (
    <>
      <ResponsiveNavigation logo={data.logo} />

      <Hero
        companyName={data.name!}
        description={data.description!}
        headline={data.headline!}
        loading={loading}
      />
      <Tutorials data={data.tutorials!} loading={loading} />
      <Announcements data={data.announcements!} loading={loading} />
      <Insights data={data.insights!} loading={loading} />
    </>
  );
}
