import { navItems } from "./nav-links-index";

export type NavItem = {
  link: string;
  hub: string;
  module?: string;
  category?: string;
  entity?: string;
  name: string;
  emojie: string;
  description?: string;
  active?: boolean;
  categoryIcon?: any;
  nonSidebar?: boolean;
};

export const getCurrentNavItem = (pathname: string) => {
  return navItems.find((item: NavItem) => item.link === pathname);
};
export const getHubs = () => {
  return navItems.filter(
    (item: NavItem) => item.hub && !item.module && !item.entity
  );
};
export const getCurrentModules = (currentItem: NavItem) => {
  return navItems.filter(
    (item: NavItem) =>
      item.hub === currentItem.hub &&
      currentItem.module === item.module &&
      !item.entity
  );
};
export const getHubModules = (hub: NavItem) => {
  return navItems.filter(
    (item: NavItem) =>
      item.hub === hub.hub && hub.module === item.module && !item.entity
  );
};
export const getCurrentEntities = (currentItem: NavItem) => {
  return navItems.filter(
    (item: NavItem) =>
      item.hub === currentItem.hub &&
      currentItem.module === item.module &&
      !item.module &&
      !item.hub
  );
};
export const getModuleEntities = (module: NavItem) => {
  return navItems.filter(
    (item: NavItem) =>
      item.hub === module.hub &&
      module.module === item.module &&
      !item.module &&
      !item.hub
  );
};

export const nestedNavItems = navItems.reduce((acc: any, item: NavItem) => {
  const { hub, module, entity } = item;
  if (!acc[hub]) acc[hub] = { ...item, modules: {} };
  if (module && !entity) {
    if (!acc[hub].modules[module])
      acc[hub].modules[module] = { ...item, entities: [] };
  }
  if (module && entity) {
    if (!acc[hub].modules[module])
      acc[hub].modules[module] = { ...item, entities: [] };
    acc[hub].modules[module].entities.push(item);
  }
  return acc;
}, {});

export const navigationItems = navItems.filter((item) => !item.nonSidebar);

export const groupEntitiesByCategory = (
  items: NavItem[]
): { categoryName: string; categoryIcon: any; entities: NavItem[] }[] => {
  const categoryMap: Record<
    string,
    { categoryName: string; categoryIcon: any; entities: NavItem[] }
  > = {};

  items.forEach((item) => {
    if (item.nonSidebar) return;
    if (!item.category) return;

    if (!categoryMap[item.category]) {
      categoryMap[item.category] = {
        categoryName: item.category,
        categoryIcon: item.categoryIcon,
        entities: [],
      };
    }

    categoryMap[item.category].entities.push(item);
  });

  return Object.values(categoryMap);
};
