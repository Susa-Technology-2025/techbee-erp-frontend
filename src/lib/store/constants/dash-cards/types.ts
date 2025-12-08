export interface PackageFeature {
  name: string;
  description: string;
  plan: "free" | "starter" | "pro" | "premium";
  subscribed: boolean;
  active: boolean;
  underMaintainance: boolean;
  link: string;
}

export interface Package {
  title: string;
  onTrial: boolean;
  description: string;
  icon: string;
  href: string;
  rolesAllowed: string[];
  color: string;
  category: "module" | "moduleFeature";
  features?: PackageFeature[];
  parentModule?: string;
  active?: boolean;
  general?: boolean;
}
