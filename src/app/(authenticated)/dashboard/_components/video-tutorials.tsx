import { Box, Grid, Typography, Chip, CircularProgress } from "@mui/material";
import { PlayCircleOutline, CheckCircleOutline } from "@mui/icons-material";

interface VideoTutorial {
  id: string;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  progress?: number;
  isCompleted?: boolean;
}

const VideoTutorialCard = ({ tutorial }: { tutorial: VideoTutorial }) => {
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: 1,
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: 3,
          transform: "translateY(-4px)",
          "& .play-icon": {
            transform: "scale(1.1)",
          },
        },
      }}
    >
      {/* Thumbnail with Lorem Picsum */}
      <Box
        sx={{
          position: "relative",
          pt: "56.25%", // 16:9 aspect ratio
          bgcolor: "grey.200",
          overflow: "hidden",
        }}
      >
        <Box
          component="img"
          src={`https://picsum.photos/seed/${tutorial.id}/600/400`} // Dynamic random image per tutorial
          alt={tutorial.title}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.3s ease",
            "&:hover": {
              transform: "scale(1.05)",
            },
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "rgba(0,0,0,0.3)",
            color: "common.white",
          }}
        >
          <PlayCircleOutline
            className="play-icon"
            sx={{
              fontSize: { xs: "3rem", md: "4rem" },
              color: "common.white",
              opacity: 0.9,
              transition: "transform 0.3s ease",
            }}
          />
        </Box>
        <Chip
          label={tutorial.duration}
          size="small"
          sx={{
            position: "absolute",
            bottom: 8,
            right: 8,
            bgcolor: "rgba(0,0,0,0.7)",
            color: "common.white",
            backdropFilter: "blur(4px)",
          }}
        />
      </Box>

      {/* Content */}
      <Box sx={{ p: { xs: 1.5, md: 2 }, flexGrow: 1 }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: "medium",
            mb: 0.5,
            color: "text.primary",
            height: { xs: "2.5em", md: "2.5em" },
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {tutorial.title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            height: { xs: "3em", md: "3em" },
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {tutorial.description}
        </Typography>
      </Box>

      {/* Progress/Status */}
      <Box
        sx={{
          px: { xs: 1.5, md: 2 },
          pb: { xs: 1.5, md: 2 },
          display: "flex",
          alignItems: "center",
        }}
      >
        {tutorial.isCompleted ? (
          <Chip
            icon={<CheckCircleOutline fontSize="small" />}
            label="Completed"
            size="small"
            sx={{
              bgcolor: "success.light",
              color: "success.dark",
            }}
          />
        ) : tutorial.progress ? (
          <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
            <CircularProgress
              variant="determinate"
              value={tutorial.progress}
              size={24}
              thickness={6}
              sx={{
                mr: 1.5,
                color: "primary.main",
              }}
            />
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {tutorial.progress}% watched
            </Typography>
          </Box>
        ) : (
          <Chip
            label="Not started"
            size="small"
            sx={{
              bgcolor: "action.selected",
              color: "text.secondary",
            }}
          />
        )}
      </Box>
    </Box>
  );
};

const VideoTutorialSection = () => {
  // Mock data with Lorem Picsum thumbnails
  const tutorials: VideoTutorial[] = [
    {
      id: "dashboard-101",
      title: "Getting Started with Dashboard",
      description:
        "Learn the basics of navigating your new dashboard interface",
      duration: "5:23",
      thumbnail: "https://picsum.photos/seed/dashboard-101/600/400",
      progress: 45,
    },
    {
      id: "advanced-reports",
      title: "Advanced Reporting Features",
      description: "Discover how to create and customize advanced reports",
      duration: "8:45",
      thumbnail: "https://picsum.photos/seed/advanced-reports/600/400",
      isCompleted: true,
    },
    {
      id: "user-management",
      title: "User Management Tutorial",
      description: "How to add and manage users in your organization",
      duration: "6:12",
      thumbnail: "https://picsum.photos/seed/user-management/600/400",
    },
    {
      id: "custom-workspace",
      title: "Customizing Your Workspace",
      description: "Personalize your dashboard to suit your workflow",
      duration: "4:56",
      thumbnail: "https://picsum.photos/seed/custom-workspace/600/400",
      progress: 15,
    },
    {
      id: "data-import",
      title: "Data Import Guide",
      description: "Step-by-step instructions for importing your data",
      duration: "7:30",
      thumbnail: "https://picsum.photos/seed/data-import/600/400",
    },
    {
      id: "mobile-app",
      title: "Mobile App Tutorial",
      description: "Using the dashboard features on your mobile device",
      duration: "5:15",
      thumbnail: "https://picsum.photos/seed/mobile-app/600/400",
      progress: 80,
    },
  ];

  return (
    <Box sx={{ my: { xs: 4, md: 6 } }}>
      <Typography
        variant="h5"
        sx={{
          mb: { xs: 2, md: 3 },
          fontWeight: "bold",
          color: "text.primary",
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <PlayCircleOutline sx={{ color: "primary.main" }} />
        Video Tutorials
        <Chip
          label={`${tutorials.length} tutorials`}
          size="small"
          sx={{ ml: 1, bgcolor: "action.selected" }}
        />
      </Typography>

      <Grid container spacing={{ xs: 2, md: 3 }}>
        {tutorials.map((tutorial) => (
          <Grid key={tutorial.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <VideoTutorialCard tutorial={tutorial} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default VideoTutorialSection;
