"use client";

import { useDataQuery } from "@/lib/tanstack/useDataQuery";
import { Paper, CircularProgress, Alert } from "@mui/material";
import {
  Business,
  CorporateFare,
  Groups,
  LocationCity,
  ChevronRight,
  ExpandMore,
  FiberManualRecord,
  Circle,
} from "@mui/icons-material";
import React from "react";

export default function OrganizationTree() {
  const {
    data: treeData,
    isLoading,
    isError,
  } = useDataQuery({
    apiEndPoint:
      "https://api.techbee.et/api/core/organizationNodes/organization-tree",
    noFilter: true,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96 bg-white">
        <div className="text-center">
          <CircularProgress size={60} className="text-blue-600 mb-4" />
          <p className="text-gray-700 text-lg">
            Loading organization structure...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4">
        <Alert severity="error">
          Failed to load organization data. Please try again later.
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Organization Structure
          </h1>
          <p className="text-gray-600">
            {treeData?.meta?.totalRowCount || 0} root organizations
          </p>
        </div>

        {/* Tree Container */}
        <Paper elevation={1} className="bg-white rounded-lg">
          <div className="p-6">
            {treeData?.data ? (
              <div className="space-y-1">
                {treeData.data.map((node, index) => (
                  <React.Fragment key={node.id}>
                    <OrganizationNode node={node} level={0} />
                    {index < treeData.data.length - 1 && (
                      <div className="h-px bg-gray-200 my-2"></div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Business className="text-4xl mb-4 opacity-40" />
                <p>No organization data available</p>
              </div>
            )}
          </div>
        </Paper>
      </div>
    </div>
  );
}

const OrganizationNode = ({ node, level }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const hasChildren = node.childNodes && node.childNodes.length > 0;

  const getNodeIcon = (type, isActive) => {
    const baseClass = "text-xl";
    const opacityClass = isActive ? "opacity-100" : "opacity-50";

    switch (type) {
      case "Company":
        return (
          <Business className={`${baseClass} ${opacityClass} text-blue-700`} />
        );
      case "SubCompany":
        return (
          <CorporateFare
            className={`${baseClass} ${opacityClass} text-purple-700`}
          />
        );
      case "Branch":
        return (
          <LocationCity
            className={`${baseClass} ${opacityClass} text-orange-700`}
          />
        );
      case "Department":
        return (
          <Groups className={`${baseClass} ${opacityClass} text-green-700`} />
        );
      default:
        return (
          <Business className={`${baseClass} ${opacityClass} text-gray-600`} />
        );
    }
  };

  const getStatusColor = (isActive) => {
    return isActive ? "text-green-600" : "text-red-600";
  };

  const handleToggle = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className="select-none">
      {/* Main Node */}
      <div
        className={`flex items-center py-3 px-3 rounded-md transition-colors duration-150 ${
          hasChildren ? "cursor-pointer hover:bg-gray-100" : "cursor-default"
        } ${level > 0 ? "ml-8" : ""}`}
        onClick={handleToggle}
      >
        {/* Expand/Collapse Icon */}
        <div className="flex items-center justify-center w-6 h-6 mr-2">
          {hasChildren ? (
            <div
              className={`transform transition-transform duration-200 ${
                isExpanded ? "rotate-90 text-blue-700" : "text-gray-500"
              }`}
            >
              <ChevronRight fontSize="small" />
            </div>
          ) : (
            <FiberManualRecord className="text-gray-400 text-xs" />
          )}
        </div>

        {/* Node Icon */}
        <div className="flex items-center justify-center w-8 mr-3">
          {getNodeIcon(node.typeField, node.isActive)}
        </div>

        {/* Node Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center mb-1">
            <span
              className={`font-semibold text-gray-900 ${
                !node.isActive ? "opacity-60" : ""
              }`}
            >
              {node.name}
            </span>
            <div
              className={`flex items-center ml-3 ${getStatusColor(
                node.isActive
              )}`}
            >
              <Circle className="text-xs mr-1" />
              <span className="text-xs font-medium">
                {node.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded border">
              Code: {node.code}
            </span>
            <span className="text-sm text-gray-600 bg-blue-50 px-2 py-1 rounded border border-blue-100">
              {node.typeField}
            </span>
            <span className="text-sm text-gray-500">Level {node.level}</span>
            {hasChildren && (
              <span className="text-sm text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-100">
                {node.childNodes.length}{" "}
                {node.childNodes.length === 1 ? "child" : "children"}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="relative border-l-2 border-gray-300 ml-6">
          {node.childNodes.map((childNode, index) => (
            <div key={childNode.id} className="relative">
              {/* Horizontal connector line */}
              {index < node.childNodes.length - 1 && (
                <div className="absolute left-0 top-8 w-4 h-px bg-gray-300"></div>
              )}
              <OrganizationNode node={childNode} level={level + 1} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
