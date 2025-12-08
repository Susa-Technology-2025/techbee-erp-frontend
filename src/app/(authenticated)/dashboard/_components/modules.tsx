"use client";
import ModuleCardGrid from "@/components/reusable-cards/cards-container";
import { mainDashCards } from "@/lib/store/constants/dash-cards/main-dash-cards";
import {
  Box,
  TextField,
  Autocomplete,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { useState, useMemo } from "react";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";

export default function Modules() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const allCategories = useMemo(() => {
    const categories = new Set<string>();
    mainDashCards.forEach((card) => {
      if (card.packageCategory) {
        categories.add(card.packageCategory);
      }
    });
    return Array.from(categories).sort();
  }, []);

  const filteredCards = useMemo(() => {
    return mainDashCards.filter((card) => {
      const matchesSearch =
        card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategories.length === 0 ||
        (card.packageCategory &&
          selectedCategories.includes(card.packageCategory));

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategories]);

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 2,
      }}
    >
      <Stack spacing={3} sx={{ mb: 4, width: "100%" }} direction={"row"}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          {/* Search Input */}
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search modules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />
              ),
              sx: {
                borderRadius: 2,
                backgroundColor: "background.paper",
                maxWidth: 400,
              },
            }}
            sx={{
              flexGrow: 1,
            }}
          />

          {/* Category Filter */}
          <Autocomplete
            multiple
            options={allCategories}
            value={selectedCategories}
            onChange={(_, newValue) => setSelectedCategories(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder="Filter by category"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <FilterListIcon sx={{ color: "text.secondary", mr: 1 }} />
                      {params.InputProps.startAdornment}
                    </>
                  ),
                  sx: {
                    borderRadius: 2,
                    backgroundColor: "background.paper",
                    minWidth: 250,
                  },
                }}
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={option}
                  label={option}
                  size="small"
                  sx={{
                    mr: 1,
                    textTransform: "capitalize",
                  }}
                />
              ))
            }
            sx={{
              flexGrow: 1,
              maxWidth: 400,
            }}
          />
        </Box>

        {/* Results Count */}
        {searchTerm || selectedCategories.length > 0 ? (
          <Typography variant="body2" color="text.secondary">
            Showing {filteredCards.length} of {mainDashCards.length} modules
          </Typography>
        ) : null}
      </Stack>

      <ModuleCardGrid
        title="Subscribed Features"
        description="Unlock more power with your subscribed Modules"
        cards={filteredCards}
      />
    </Box>
  );
}
