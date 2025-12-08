"use client";

import { useState } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Tabs,
  Tab,
  Typography,
  MenuItem,
  Checkbox,
  ListItemText,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

export default function UserRolesModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>User & Roles Management</DialogTitle>
      <DialogContent>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ mb: 2 }}
        >
          <Tab label="User Creation" />
          <Tab label="Role Creation" />
          <Tab label="Assign Users a Role" />
        </Tabs>

        {/* User Creation Tab */}
        <TabPanel value={tabIndex} index={0}>
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            placeholder="Enter username"
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            placeholder="Enter email"
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            placeholder="Enter password"
          />
          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            margin="normal"
            placeholder="Confirm password"
          />
        </TabPanel>

        {/* Role Creation Tab */}
        <TabPanel value={tabIndex} index={1}>
          <TextField
            label="Role Name"
            fullWidth
            margin="normal"
            placeholder="Enter role name"
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            placeholder="Enter description"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Permissions</InputLabel>
            <Select multiple defaultValue={[]} renderValue={(selected) => (selected as string[]).join(", ")}>
              <MenuItem value="read">
                <Checkbox /> <ListItemText primary="Read" />
              </MenuItem>
              <MenuItem value="write">
                <Checkbox /> <ListItemText primary="Write" />
              </MenuItem>
              <MenuItem value="delete">
                <Checkbox /> <ListItemText primary="Delete" />
              </MenuItem>
              <MenuItem value="admin">
                <Checkbox /> <ListItemText primary="Admin" />
              </MenuItem>
            </Select>
          </FormControl>
        </TabPanel>

        {/* Assign Users a Role Tab */}
        <TabPanel value={tabIndex} index={2}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Select Users</InputLabel>
            <Select multiple defaultValue={[]} renderValue={(selected) => (selected as string[]).join(", ")}>
              <MenuItem value="user1">
                <Checkbox /> <ListItemText primary="User 1" />
              </MenuItem>
              <MenuItem value="user2">
                <Checkbox /> <ListItemText primary="User 2" />
              </MenuItem>
              <MenuItem value="user3">
                <Checkbox /> <ListItemText primary="User 3" />
              </MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Select Role</InputLabel>
            <Select defaultValue="">
              <MenuItem value="admin">Administrator</MenuItem>
              <MenuItem value="editor">Editor</MenuItem>
              <MenuItem value="viewer">Viewer</MenuItem>
            </Select>
          </FormControl>
        </TabPanel>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
}
