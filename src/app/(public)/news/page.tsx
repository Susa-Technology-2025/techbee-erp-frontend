"use client";

import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Grid,
  useTheme,
  alpha,
  Button,
} from "@mui/material";
import {
  CalendarToday,
  Person,
  ArrowForward,
  NewReleases,
} from "@mui/icons-material";

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: string;
  category: string;
  imageUrl?: string;
  readTime: string;
  featured: boolean;
}

const NewsPage = () => {
  const theme = useTheme();

  // Empty array for now - no news articles
  const newsArticles: NewsArticle[] = [];

  const getCategoryColor = (category: string) => {
    const colors = {
      Technology: theme.palette.primary.main,
      Business: theme.palette.secondary.main,
      Design: theme.palette.success.main,
      Development: theme.palette.info.main,
      Company: theme.palette.warning.main,
      Updates: theme.palette.error.main,
    };
    return colors[category as keyof typeof colors] || theme.palette.grey[500];
  };

  return (
    <Container maxWidth="xl" sx={{ py: 8 }}>
      {/* Header Section */}
      <Box sx={{ textAlign: "center", mb: 8 }}>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <NewReleases
            sx={{
              fontSize: 60,
              color: theme.palette.primary.main,
              mb: 2,
            }}
          />
        </Box>
        <Typography
          variant="h1"
          component="h1"
          gutterBottom
          sx={{
            color: theme.palette.text.primary,
            fontWeight: 800,
            fontSize: { xs: "2.5rem", md: "3.5rem" },
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            mb: 2,
          }}
        >
          Latest News
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: theme.palette.text.secondary,
            maxWidth: 600,
            mx: "auto",
            fontSize: "1.2rem",
          }}
        >
          Stay updated with our latest announcements, insights, and company news
        </Typography>
      </Box>

      {newsArticles.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 12 }}>
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 4,
            }}
          >
            <NewReleases
              sx={{
                fontSize: 60,
                color: theme.palette.primary.main,
              }}
            />
          </Box>

          <Typography
            variant="h3"
            gutterBottom
            sx={{
              color: theme.palette.text.primary,
              fontWeight: 700,
              mb: 2,
            }}
          >
            No News Yet
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.secondary,
              maxWidth: 500,
              mx: "auto",
              mb: 4,
            }}
          >
            We're working on some exciting updates and stories to share with
            you. Check back soon for the latest news and announcements!
          </Typography>

          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 3,
              fontSize: "1.1rem",
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: theme.shadows[8],
              },
              transition: "all 0.3s ease",
            }}
          >
            Subscribe for Updates
          </Button>
        </Box>
      ) : (
        <Grid container spacing={4}>
          {/* Featured Article */}
          {newsArticles
            .filter((article) => article.featured)
            .map((article) => (
              <Grid item xs={12} key={article.id}>
                <Card
                  sx={{
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 4,
                    overflow: "hidden",
                    boxShadow: theme.shadows[4],
                    transition: "all 0.4s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: theme.shadows[16],
                    },
                  }}
                >
                  <Grid container>
                    <Grid item xs={12} md={6}>
                      <CardMedia
                        component="img"
                        height="400"
                        image={article.imageUrl}
                        alt={article.title}
                        sx={{
                          objectFit: "cover",
                          height: "100%",
                          minHeight: 400,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <CardContent
                        sx={{
                          p: 5,
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Box sx={{ mb: 2 }}>
                          <Chip
                            label="Featured"
                            sx={{
                              backgroundColor: theme.palette.warning.main,
                              color: theme.palette.warning.contrastText,
                              fontWeight: 600,
                            }}
                          />
                          <Chip
                            label={article.category}
                            sx={{
                              ml: 1,
                              backgroundColor: getCategoryColor(
                                article.category
                              ),
                              color: theme.palette.getContrastText(
                                getCategoryColor(article.category)
                              ),
                              fontWeight: 600,
                            }}
                          />
                        </Box>

                        <Typography
                          variant="h3"
                          component="h2"
                          gutterBottom
                          sx={{
                            color: theme.palette.text.primary,
                            fontWeight: 700,
                            fontSize: { xs: "1.8rem", md: "2.2rem" },
                            lineHeight: 1.2,
                          }}
                        >
                          {article.title}
                        </Typography>

                        <Typography
                          variant="body1"
                          sx={{
                            color: theme.palette.text.secondary,
                            fontSize: "1.1rem",
                            lineHeight: 1.6,
                            mb: 3,
                            flexGrow: 1,
                          }}
                        >
                          {article.excerpt}
                        </Typography>

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            gap: 2,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <Person
                                sx={{
                                  fontSize: 18,
                                  color: theme.palette.text.secondary,
                                }}
                              />
                              <Typography
                                variant="body2"
                                sx={{ color: theme.palette.text.secondary }}
                              >
                                {article.author}
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                                ml: 2,
                              }}
                            >
                              <CalendarToday
                                sx={{
                                  fontSize: 18,
                                  color: theme.palette.text.secondary,
                                }}
                              />
                              <Typography
                                variant="body2"
                                sx={{ color: theme.palette.text.secondary }}
                              >
                                {new Date(
                                  article.publishDate
                                ).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Box>
                          <Chip
                            label={`${article.readTime} read`}
                            variant="outlined"
                            sx={{ color: theme.palette.text.secondary }}
                          />
                        </Box>
                      </CardContent>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            ))}

          {/* Regular Articles */}
          {newsArticles
            .filter((article) => !article.featured)
            .map((article) => (
              <Grid item xs={12} md={6} lg={4} key={article.id}>
                <Card
                  sx={{
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 3,
                    overflow: "hidden",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: theme.shadows[8],
                    },
                  }}
                >
                  {article.imageUrl && (
                    <CardMedia
                      component="img"
                      height="200"
                      image={article.imageUrl}
                      alt={article.title}
                      sx={{ objectFit: "cover" }}
                    />
                  )}

                  <CardContent
                    sx={{
                      p: 3,
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Box sx={{ mb: 2 }}>
                      <Chip
                        label={article.category}
                        size="small"
                        sx={{
                          backgroundColor: getCategoryColor(article.category),
                          color: theme.palette.getContrastText(
                            getCategoryColor(article.category)
                          ),
                          fontWeight: 600,
                        }}
                      />
                    </Box>

                    <Typography
                      variant="h5"
                      component="h3"
                      gutterBottom
                      sx={{
                        color: theme.palette.text.primary,
                        fontWeight: 600,
                        lineHeight: 1.3,
                        flexGrow: 1,
                      }}
                    >
                      {article.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.palette.text.secondary,
                        lineHeight: 1.5,
                        mb: 2,
                      }}
                    >
                      {article.excerpt}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mt: "auto",
                        pt: 2,
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <CalendarToday
                          sx={{
                            fontSize: 16,
                            color: theme.palette.text.secondary,
                          }}
                        />
                        <Typography
                          variant="caption"
                          sx={{ color: theme.palette.text.secondary }}
                        >
                          {new Date(article.publishDate).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Chip
                        label={`${article.readTime}`}
                        size="small"
                        variant="outlined"
                        sx={{ color: theme.palette.text.secondary }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>
      )}
    </Container>
  );
};

export default NewsPage;
