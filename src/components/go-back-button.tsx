"use client";

import { IconButton } from "@mui/material";
import { useRouter } from "next/navigation";
import { ArrowBack, Fullscreen, FullscreenExit } from "@mui/icons-material";
import { useState } from "react";

export default function BackAndFullScreenButtons() {
  const router = useRouter();
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleGoBack = () => {
    router.back();
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  return (
    <>
      <IconButton onClick={handleGoBack}>
        <ArrowBack />
      </IconButton>
      <IconButton onClick={toggleFullScreen}>
        {isFullScreen ? <FullscreenExit /> : <Fullscreen />}
      </IconButton>
    </>
  );
}
