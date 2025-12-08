"use client";
import { Box, Typography, Skeleton } from "@mui/material";
import { session } from "@/lib/auth/session";
import { useState, useEffect } from "react";
import ModuleCard from "./module-cards";
import { DashCard } from "@/lib/store/constants/dash-cards/types";

export default function ModuleCardGrid({
  cards,
  title,
  description,
}: {
  cards: DashCard[];
  title?: string;
  description?: string;
  cols?: number;
}) {
  const [userRoles, setUserRoles] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchSession = async () => {
      try {
        const user = await session();
        if (isMounted) {
          setUserRoles(user?.role || []);
        }
      } catch (error) {
        console.error("Failed to fetch session:", error);
        if (isMounted) {
          setUserRoles([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchSession();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading || userRoles === null) {
    return (
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: `repeat(auto-fill, minmax(200px, 1fr))`,
            gap: 2,
          }}
        >
          {cards.map((card) => (
            <Skeleton
              key={`skeleton-${card.title}-${card.href}`}
              variant="rounded"
              width={200}
              height={200}
              sx={{ borderRadius: 2 }}
            />
          ))}
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 4 }}>
      {/* {title && (
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          {title}
        </Typography>
      )}
      {description && (
        <Typography variant="body2" sx={{ mb: 2 }}>
          {description}
        </Typography>
      )} */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: `repeat(auto-fill, minmax(200px, 1fr))`,
          gap: 2,
        }}
      >
        {cards.map((card) => (
          <ModuleCard
            key={`${card.title}-${card.href}`}
            {...card}
            userRoles={userRoles}
            isLoading={false}
          />
        ))}
      </Box>
    </Box>
  );
}
