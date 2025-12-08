import { cookies } from "next/headers";
import { themes, ThemeName } from "./themes";

export const THEME_COOKIE_NAME = "theme";

export async function getThemeFromCookie(): Promise<ThemeName> {
  const theme = (await cookies()).get(THEME_COOKIE_NAME)?.value;
  return theme && themes[theme as ThemeName] ? (theme as ThemeName) : "purple";
}
