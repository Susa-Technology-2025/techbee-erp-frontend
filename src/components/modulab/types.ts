export type Hub = {
  title: string;
  pageLink: string;
  icon: string;
  order: number;
  ariaLabel: string;
  code: string;
  modules: Module[];
};

export type Module = {
  title: string;
  pageLink: string;
  icon: string;
  order: number;
  ariaLabel: string;
  code: string;
  entities: Entity[];
};

export type Entity = {
  title: string;
  pageLink: string;
  allowedPermissions: string[];
  icon: string;
  description: string;
  category: string;
  order: number;
  ariaLabel: string;
  disabled: boolean;
  code: string;
};
