import { Box, Typography, Stack, Avatar } from "@mui/material";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";

export default async function DailyInspiration() {
  let quote = {
    content: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
  };

  try {
    const res = await fetch("https://zenquotes.io/api/random", {
      next: { revalidate: 60 },
    });

    if (res.ok) {
      const data = await res.json();
      quote = {
        content: data[0].q,
        author: data[0].a,
      };
    }
  } catch (err) {
    // fallback quote already defined
  }

  return (
    <Box
      sx={{
        mt: 4,
        px: 3,
        py: 2.5,
        borderRadius: 3,
        backgroundColor: "background.paper",
        boxShadow: 3,
        position: "relative",
        maxWidth: 600,
        mx: "auto",
        textAlign: "center",
        borderLeft: "5px solid",
        borderColor: "primary.main",
      }}
    >
      <Stack direction="row" justifyContent="center" mb={1}>
        <Avatar sx={{ bgcolor: "primary.light", width: 40, height: 40 }}>
          <FormatQuoteIcon sx={{ color: "white" }} />
        </Avatar>
      </Stack>
      <Typography
        variant="h6"
        sx={{
          fontStyle: "italic",
          color: "text.secondary",
          mb: 2,
        }}
      >
        "{quote.content}"
      </Typography>
      <Typography
        variant="subtitle2"
        sx={{
          color: "text.primary",
          fontWeight: 600,
        }}
      >
        — {quote.author}
      </Typography>
    </Box>
  );
}
