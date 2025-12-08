import { NavItem } from "../nav-items/nav-items-utils";
import { navigationItems } from "../nav-items/nav-items-utils";
interface SimpleNavObject {
  id: string;
  name: string;
  emojie: string;
  link: string;
}
type CurrentModule = SimpleNavObject & {
  hub?: string;
};
type CurrentEntity = SimpleNavObject;
export const getCurrentModule = (pathname: string): CurrentModule | null => {
  let bestMatch: NavItem | null = null;
  let longestMatchLength = 0;
  for (const item of navigationItems) {
    if (item.link && item.module) {
      if (
        pathname.startsWith(item.link) &&
        item.link.length > longestMatchLength
      ) {
        bestMatch = item;
        longestMatchLength = item.link.length;
      }
    }
  }
  if (!bestMatch) {
    return null;
  }
  const moduleName = bestMatch.module;
  const moduleEntry = navigationItems.find(
    (item) => item.module === moduleName && !item.entity
  );
  const nameToUse = moduleEntry ? moduleEntry.name : bestMatch.name;
  const emojieToUse = moduleEntry ? moduleEntry.emojie : bestMatch.emojie;
  const linkToUse = moduleEntry ? moduleEntry.link : bestMatch.link;
  return {
    id: moduleName!,
    name: nameToUse,
    emojie: emojieToUse,
    link: linkToUse,
    hub: bestMatch.hub,
  };
};
export const getCurrentEntity = (pathname: string): CurrentEntity | null => {
  let bestMatch: NavItem | null = null;
  let longestMatchLength = 0;
  for (const item of navigationItems) {
    if (item.link && item.entity) {
      if (
        pathname.startsWith(item.link) &&
        item.link.length > longestMatchLength
      ) {
        bestMatch = item;
        longestMatchLength = item.link.length;
      }
    }
  }
  if (!bestMatch) {
    return null;
  }
  return {
    id: bestMatch.entity!,
    name: bestMatch.name,
    emojie: bestMatch.emojie,
    link: bestMatch.link,
  };
};
export const getCurrentHub = (
  currentModule: CurrentModule | null
): any | null => {
  if (!currentModule || !currentModule.hub) return null;
  const hubId = currentModule.hub;
  const hubEntry = navigationItems.find(
    (item) => item.hub === hubId && !item.module && !item.entity
  );
  if (hubEntry) {
    return {
      id: hubId,
      name: hubEntry.name,
      emojie: hubEntry.emojie,
      link: hubEntry.link,
    };
  }
  return {
    id: hubId,
    name: hubId.charAt(0).toUpperCase() + hubId.slice(1),
    emojie: "🏠",
    link: `/${hubId}`,
  };
};
