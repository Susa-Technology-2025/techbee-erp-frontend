import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

type ExportButtonProps = {
  onClick: () => void;
  tooltip?: string;
  disabled?: boolean;
};

const ExportButton: React.FC<ExportButtonProps> = ({ onClick, tooltip = "Export", disabled }) => (

  <Tooltip title={tooltip} placement="top">
    <span style={{ backgroundColor: "#CECECE", borderRadius: "50%", boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)" }}>
      <IconButton onClick={onClick} disabled={disabled} color="primary" size="medium">
        <FileDownloadIcon />
      </IconButton>
    </span>
  </Tooltip>
);

export default ExportButton; 