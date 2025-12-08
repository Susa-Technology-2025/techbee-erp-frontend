"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

interface BreadcrumbItem {
  href: string;
  label: string;
}

const DynamicBreadcrumbs: React.FC = () => {
  const pathname = usePathname();

  const pathSegments = pathname.split("/").filter((segment) => segment);

  const breadcrumbItems: BreadcrumbItem[] = [{ href: "/", label: "Home" }];

  pathSegments.forEach((segment, index) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/");

    const label =
      segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");

    breadcrumbItems.push({ href, label });
  });

  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextIcon fontSize="small" />}
      sx={{ my: 2 }}
    >
      {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1;

        if (isLast) {
          return (
            <Typography key={item.href} color="text.primary">
              {item.label}
            </Typography>
          );
        } else {
          return (
            <Link key={item.href} href={item.href}>
              <Typography
                component="span"
                color="inherit"
                sx={{ "&:hover": { textDecoration: "underline" } }}
              >
                {item.label}
              </Typography>
            </Link>
          );
        }
      })}
    </Breadcrumbs>
  );
};

export default DynamicBreadcrumbs;
