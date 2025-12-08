// AddMenuContent.jsx (Content for the "Add" Popover)

import React from "react";
import { useTheme } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import {
  FaTag,
  FaRegClock,
  FaRegCheckSquare,
  FaUser,
  FaPaperclip,
} from "react-icons/fa";

const addMenuData = [
  {
    title: "Labels",
    description: "Organize, categorize, and prioritize",
    icon: <FaTag size={20} />,
  },
  {
    title: "Dates",
    description: "Start dates, due dates, and reminders",
    icon: <FaRegClock size={20} />,
  },
  {
    title: "Checklist",
    description: "Add subtasks",
    icon: <FaRegCheckSquare size={20} />,
  },
  {
    title: "Members",
    description: "Assign members",
    icon: <FaUser size={20} />,
  },
  {
    title: "Attachment",
    description: "Add links, pages, work items, and more",
    icon: <FaPaperclip size={20} />,
  },
];

const AddMenuContent = ({ onClose }) => {
  const theme = useTheme();

  return (
    <Box sx={{ p: 0.5, "& > button": { mb: 0.5 } }}>
      {addMenuData.map((item) => (
        <Button
          key={item.title}
          fullWidth
          onClick={() => {
            console.log(`${item.title} action triggered!`);
            onClose();
          }}
          sx={{
            justifyContent: "flex-start",
            textTransform: "none",
            py: 1,
            borderRadius: 1,
            color: theme.palette.text.primary,
            "&:hover": {
              bgcolor: theme.palette.action.hover,
            },
          }}
        >
          <Box
            sx={{
              width: 32,
              flexShrink: 0,
              color: theme.palette.text.secondary,
              mr: 1,
            }}
          >
            {item.icon}
          </Box>
          <Box sx={{ textAlign: "left", flexGrow: 1 }}>
            <p className="font-medium text-sm">{item.title}</p>
            <p
              className="text-xs"
              style={{ color: theme.palette.text.secondary }}
            >
              {item.description}
            </p>
          </Box>
        </Button>
      ))}
    </Box>
  );
};

export default AddMenuContent;
