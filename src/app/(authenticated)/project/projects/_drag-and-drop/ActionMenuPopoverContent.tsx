// ActionMenuPopover.jsx

import React from "react";

// This component represents the visual content *inside* the MUI Popover
// It receives the items (Labels, Dates, etc.) and a close handler.
const ActionMenuPopoverContent = ({ onClose }) => {
  const menuItems = [
    {
      title: "Labels",
      description: "Organize, categorize, and prioritize",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M7 7h.01M7 3h.01M7 21h.01M7 17h.01M7 13h.01M7 9h.01M17 7h.01M17 3h.01M17 21h.01M17 17h.01M17 13h.01M17 9h.01M13 7h.01M13 3h.01M13 21h.01M13 17h.01M13 13h.01M13 9h.01M3 7h.01M3 3h.01M3 21h.01M3 17h.01M3 13h.01M3 9h.01M21 7h.01M21 3h.01M21 21h.01M21 17h.01M21 13h.01M21 9h.01"
          ></path>
        </svg>
      ),
    },
    {
      title: "Dates",
      description: "Start dates, due dates, and reminders",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 7V3m8 4V3m-4 4h.01M3 17h18M5 10h14a2 2 0 012 2v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4a2 2 0 012-2z"
          ></path>
        </svg>
      ),
    },
    {
      title: "Checklist",
      description: "Add subtasks",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          ></path>
        </svg>
      ),
    },
    {
      title: "Members",
      description: "Assign members",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          ></path>
        </svg>
      ),
    },
    {
      title: "Attachment",
      description: "Add links, pages, work items, and more",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
          ></path>
        </svg>
      ),
    },
  ];

  return (
    // Outer container matching the dark design
    <div className="w-72 bg-[#282a2e] text-white rounded shadow-2xl">
      {/* Popover Header */}
      <div className="p-3 border-b border-gray-600 flex justify-between items-center">
        <h3 className="font-semibold text-sm">Add to card</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>

      {/* Popover Body - Menu Items */}
      <div className="p-1 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.title}
            className="w-full text-left p-2 rounded flex items-center hover:bg-gray-600 transition"
            onClick={() => {
              console.log(`${item.title} clicked!`);
              // You can add logic here to open a *new* dialog for the feature
              onClose();
            }}
          >
            <div className="w-8 flex-shrink-0 text-gray-400">{item.icon}</div>
            <div>
              <p className="font-medium text-sm">{item.title}</p>
              <p className="text-xs text-gray-400">{item.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ActionMenuPopoverContent;
