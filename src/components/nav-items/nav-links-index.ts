import { inActiveLinks } from "./future-links";
import { hrLinks } from "./hr-links";
import { NavItem } from "./nav-items-utils";
import { projectLinks } from "./project-links";
import { recruitmentLinks } from "./recruitment-links";
import { selfServiceLinks } from "./self-service-links";
import { settingsModulabs } from "./settings-links";
import { trainingModulabs } from "./training-links";

export const navItems: NavItem[] = [
  ...hrLinks,
  ...selfServiceLinks,
  ...settingsModulabs,
  ...trainingModulabs,
  ...projectLinks,
  ...inActiveLinks,
  ...recruitmentLinks
];
