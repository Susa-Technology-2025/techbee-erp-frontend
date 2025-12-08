"use client";

import { usePathname, useRouter } from "next/navigation";
import { i18nConfig } from "@/lib/i18n/i18nConfig";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import { useState } from "react";

export default function SelectLanguage() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const currentLocale = pathname.split("/")[1] || i18nConfig.defaultLocale;

  const handleChange = (event: any) => {
    const newLocale = event.target.value;

    const days = 30;
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = date.toUTCString();
    document.cookie = `NEXT_LOCALE=${newLocale};expires=${expires};path=/`;

    if (
      currentLocale === i18nConfig.defaultLocale &&
      !i18nConfig.prefixDefault
    ) {
      router.push("/" + newLocale + pathname);
    } else {
      router.push(pathname.replace(`/${currentLocale}`, `/${newLocale}`));
    }

    router.refresh();
  };

  return (
    <FormControl variant="outlined" size="small">
      <InputLabel id="language-select-label" sx={{ display: "none" }}>
        Select language
      </InputLabel>
      <Select
        labelId="language-select-label"
        value={currentLocale}
        onChange={handleChange}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        open={open}
        aria-label="Select language"
        sx={{
          color: "text.primary",
          backgroundColor: "transparent",
          width: 60,
          "& .MuiSelect-select": {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pr: "24px !important",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
        }}
        IconComponent={() => (
          <LanguageIcon
            aria-hidden="true"
            sx={{
              color: open ? "primary.main" : "text.secondary",
              fontSize: "1.25rem",
              mr: 1,
              transition: "color 0.2s ease",
              pointerEvents: "none", // Prevent interaction
            }}
          />
        )}
        MenuProps={{
          PaperProps: {
            sx: {
              mt: 1.5,
              boxShadow: 2,
              borderRadius: 1.5,
              "& .MuiMenuItem-root": {
                px: 2,
                py: 1,
                minHeight: "auto",
                "&:hover": {
                  backgroundColor: "action.hover",
                },
              },
            },
          },
        }}
      >
        {i18nConfig.locales.map((locale) => (
          <MenuItem
            key={locale}
            value={locale}
            sx={{
              fontWeight: currentLocale === locale ? 600 : 400,
              color: currentLocale === locale ? "primary.main" : "text.primary",
            }}
          >
            {locale.toUpperCase()}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
