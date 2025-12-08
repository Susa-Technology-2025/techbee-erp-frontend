'use client';
import React from 'react';
import {
  Paper,
  InputBase,
  IconButton,
  Divider,
  Tooltip,
  Tabs,
  Tab,
} from '@mui/material';
import { Search as SearchIcon, FilterList as FilterIcon } from '@mui/icons-material';
import { Star as StarIcon } from '@mui/icons-material';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm, activeFilter, setActiveFilter }) => {
  return (
    <Paper
      sx={{
        p: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        mb: 4,
        borderRadius: 4,
        boxShadow: '0 8px 16px rgba(0,0,0,0.05)',
        maxWidth: 800,
        mx: 'auto',
      }}
    >
      <InputBase
        sx={{ ml: 2, flex: 1 }}
        placeholder="Search applications..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        startAdornment={<SearchIcon sx={{ color: 'action.active', mr: 1 }} />}
      />
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <Tooltip title="Filter applications">
        <IconButton sx={{ p: '10px' }}>
          <FilterIcon />
        </IconButton>
      </Tooltip>
      <Tabs
        value={activeFilter}
        onChange={(e, newValue) => setActiveFilter(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          minHeight: 40,
          '& .MuiTab-root': {
            minHeight: 40,
            minWidth: 'unset',
            px: 1.5,
            fontSize: '0.75rem',
          },
        }}
      >
        <Tab label="All" value="all" />
        <Tab
          label="Favorites"
          value="favorites"
          icon={<StarIcon sx={{ fontSize: 16 }} />}
          iconPosition="start"
        />
        <Tab label="Modules" value="module" />
        <Tab label="Popular" value="popular" />
        <Tab label="New" value="new" />
      </Tabs>
    </Paper>
  );
};

export default SearchBar;
