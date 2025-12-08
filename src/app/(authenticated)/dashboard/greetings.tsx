"use client";
import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";

export default function GreetingBox() {
  const { user, organization } = useSelector(
    (state: RootState) => state.session
  );
  const username = user?.firstName ?? "admin";

  const [greeting, setGreeting] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTimeAndGreeting = () => {
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes();
      const second = now.getSeconds();

      const formatTime = (unit) => (unit < 10 ? `0${unit}` : unit);
      setTime(
        `${formatTime(hour)}:${formatTime(minute)}:${formatTime(second)}`
      );

      const totalMinutes = hour * 60 + minute;
      let message;
      if (totalMinutes >= 300 && totalMinutes < 720) {
        message = "Good morning";
      } else if (totalMinutes >= 720 && totalMinutes < 1080) {
        message = "Good afternoon";
      } else {
        message = "Good evening";
      }
      setGreeting(message);
    };

    updateTimeAndGreeting();
    const timerId = setInterval(updateTimeAndGreeting, 1000);

    return () => clearInterval(timerId);
  }, []);

  if (!greeting) return null;
  const capitalizedGreeting =
    greeting.charAt(0).toUpperCase() + greeting.slice(1);
  const capitalizedUsername =
    username.charAt(0).toUpperCase() + username.slice(1);
  return (
    <Box
      sx={{
        mt: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        position: "relative",
      }}
    >
      <Typography
        variant="h3"
        sx={{
          fontWeight: 300,
          color: "text.primary",
          lineHeight: 1.2,
          mb: 0.5,
          "&:after": {
            content: '"."',
            color: "primary.main",
          },
        }}
      >
        {greeting}, {capitalizedUsername}
      </Typography>

      <Typography
        variant="subtitle1"
        sx={{
          color: "text.secondary",
          fontWeight: 400,
          mb: 2,
        }}
      >
        Hope you're doing well today
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          "&:before": {
            content: '""',
            display: "block",
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            backgroundColor: "primary.main",
          },
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontFamily: "monospace",
            color: "text.secondary",
            letterSpacing: "0.05em",
          }}
        >
          {time}
        </Typography>
      </Box>

      <Box
        sx={{
          position: "absolute",
          right: 0,
          top: 0,
          width: "60px",
          height: "60px",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          "&:after": {
            content: '""',
            position: "absolute",
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            border: "1px solid",
            borderColor: "divider",
          },
        }}
      >
        <Box
          sx={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: "primary.main",
          }}
        />
      </Box>
    </Box>
  );
}
