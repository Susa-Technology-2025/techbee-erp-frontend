export interface PackageFeature {
  name: string;
  description: string;
  plan: "free" | "starter" | "basic" | "pro" | "premium" | "enterprise";
  subscribed: boolean;
  active: boolean;
  underMaintainance: boolean;
}

export interface Package {
  title: string;
  onTrial: string;
  description: string;
  icon: string;
  href: string;
  rolesAllowed: string[];
  color: string;
  category: "module" | "moduleFeature";
  features: PackageFeature[];
  parentModule?: string;
  general?: boolean;
}
