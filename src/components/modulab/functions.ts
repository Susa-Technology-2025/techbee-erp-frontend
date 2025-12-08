import { Entity, Hub, Module } from "./types";

export function isEntityAccessible(
  entity: Entity,
  userPermissions: string[]
): boolean {
  return (
    entity.allowedPermissions.some((p) => userPermissions.includes(p)) &&
    !entity.disabled
  );
}

export function getHubs(hubs: Hub[]): Hub[] {
  return [...hubs].sort((a, b) => a.order - b.order);
}

export function getHubByCode(hubs: Hub[], code: string): Hub | undefined {
  return hubs.find((h) => h.code === code);
}

export function getModulesForHub(
  hub: Hub,
  userPermissions: string[]
): Module[] {
  return [...hub.modules]
    .filter((m) =>
      m.entities.some((e) => isEntityAccessible(e, userPermissions))
    )
    .map((m) => ({
      ...m,
      entities: m.entities.filter((e) =>
        isEntityAccessible(e, userPermissions)
      ),
    }))
    .sort((a, b) => a.order - b.order);
}

export function getModuleByCode(hubs: Hub[], code: string): Module | undefined {
  for (const hub of hubs) {
    const module = hub.modules.find((m) => m.code === code);
    if (module) return module;
  }
  return undefined;
}

export function getEntitiesForModule(
  module: Module,
  userPermissions: string[]
): Entity[] {
  return [...module.entities]
    .filter((e) => isEntityAccessible(e, userPermissions))
    .sort((a, b) => a.order - b.order);
}

export function groupEntitiesByCategory(
  module: Module,
  userPermissions: string[]
): Record<string, Entity[]> {
  return getEntitiesForModule(module, userPermissions).reduce((acc, entity) => {
    if (!acc[entity.category]) acc[entity.category] = [];
    acc[entity.category].push(entity);
    return acc;
  }, {} as Record<string, Entity[]>);
}

export function findEntityByCode(
  hubs: Hub[],
  code: string
): Entity | undefined {
  for (const hub of hubs) {
    for (const module of hub.modules) {
      const entity = module.entities.find((e) => e.code === code);
      if (entity) return entity;
    }
  }
  return undefined;
}

export function searchEntities(
  hubs: Hub[],
  query: string,
  userPermissions: string[],
  hubCode?: string
): Entity[] {
  const searchHubs = hubCode ? hubs.filter((h) => h.code === hubCode) : hubs;
  const lowerQuery = query.toLowerCase();
  const results: Entity[] = [];
  for (const hub of searchHubs) {
    for (const module of hub.modules) {
      for (const entity of module.entities) {
        if (
          isEntityAccessible(entity, userPermissions) &&
          entity.title.toLowerCase().includes(lowerQuery)
        ) {
          results.push(entity);
        }
      }
    }
  }
  return results;
}

export function generateBreadcrumbs(
  hubs: Hub[],
  hubCode: string,
  moduleCode: string,
  entityCode?: string
) {
  const hub = getHubByCode(hubs, hubCode);
  if (!hub) return [];
  const module = hub.modules.find((m) => m.code === moduleCode);
  if (!module) return [{ title: hub.title, pageLink: hub.pageLink }];
  const breadcrumbs = [
    { title: hub.title, pageLink: hub.pageLink },
    { title: module.title, pageLink: module.pageLink },
  ];
  if (entityCode) {
    const entity = module.entities.find((e) => e.code === entityCode);
    if (entity)
      breadcrumbs.push({ title: entity.title, pageLink: entity.pageLink });
  }
  return breadcrumbs;
}
