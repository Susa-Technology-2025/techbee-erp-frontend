import { Role } from "../auth/protected-routes";

export interface Setting {
  settingName: string;
  settingDescription: string;
  settingIcon: React.ReactNode;
  values?: any[];
  value: any;
  category: string;
  dependsOn?: string;
}
export interface ModulePermission {
  view: boolean;
  edit: boolean;
  delete: boolean;
  approve: boolean;
  fourEyeEnabled: boolean;
  approverRole?: Role;
}
export interface ModulePermissions {
  [module: string]: {
    [role: string]: ModulePermission;
  };
}
export const initialSettings: Setting[] = [
  {
    settingName: "Default Time Zone",
    settingDescription: "Set the default time zone for your organization",
    settingIcon: "⏰",
    values: ["UTC", "GMT", "EST", "PST", "CET", "IST", "AEST"],
    value: "UTC",
    category: "General",
  },
  {
    settingName: "Default Date Format",
    settingDescription: "Set the default date display format",
    settingIcon: "📅",
    values: ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD", "DD MMM YYYY"],
    value: "DD/MM/YYYY",
    category: "General",
  },
  {
    settingName: "Enable Multi-Currency",
    settingDescription: "Allow transactions in multiple currencies",
    settingIcon: "💰",
    value: false,
    category: "Finance",
  },
  {
    settingName: "Default Currency",
    settingDescription: "Set the default currency for transactions",
    settingIcon: "💰",
    values: ["USD", "EUR", "GBP", "JPY", "AUD", "CAD"],
    value: "USD",
    category: "Finance",
    dependsOn: "Enable Multi-Currency",
  },
  {
    settingName: "Enable Audit Logging",
    settingDescription: "Log all critical system activities",
    settingIcon: "📄",
    value: true,
    category: "Security",
  },
  {
    settingName: "Data Retention Period (months)",
    settingDescription: "How long to keep audit logs and historical data",
    settingIcon: "💾",
    values: [3, 6, 12, 24, 36],
    value: 12,
    category: "Security",
  },
  {
    settingName: "Enable Cloud Backup",
    settingDescription: "Automatically backup data to secure cloud storage",
    settingIcon: "☁️",
    value: true,
    category: "Data",
  },
  {
    settingName: "Backup Frequency",
    settingDescription: "How often to perform automated backups",
    settingIcon: "🔁",
    values: ["Daily", "Weekly", "Monthly"],
    value: "Daily",
    category: "Data",
    dependsOn: "Enable Cloud Backup",
  },
  {
    settingName: "Enable Email Notifications",
    settingDescription: "Send email alerts for system events",
    settingIcon: "📧",
    value: true,
    category: "Communication",
  },
  {
    settingName: "Minimum Password Length",
    settingDescription: "Set the minimum required password length",
    settingIcon: "🔒",
    values: [8, 10, 12, 16],
    value: 10,
    category: "Security",
  },
  {
    settingName: "Enable Two-Factor Authentication",
    settingDescription: "Require additional verification for user logins",
    settingIcon: "🛡️",
    value: false,
    category: "Security",
  },
  {
    settingName: "Default Language",
    settingDescription: "Set the default system language",
    settingIcon: "🌐",
    values: ["English", "Spanish", "French", "German", "Arabic", "Chinese"],
    value: "English",
    category: "General",
  },
  {
    settingName: "Enable API Access",
    settingDescription: "Allow integration with external systems via API",
    settingIcon: "🔗",
    value: false,
    category: "Integration",
  },
  {
    settingName: "Enable Performance Reviews",
    settingDescription: "Enable employee performance evaluation system",
    settingIcon: "📊",
    value: true,
    category: "HR",
  },
  {
    settingName: "Enable Mobile Access",
    settingDescription: "Allow access via mobile devices",
    settingIcon: "📱",
    value: true,
    category: "Access",
  },
  {
    settingName: "Enable GDPR Compliance",
    settingDescription: "Enable features to comply with GDPR regulations",
    settingIcon: "🛡️",
    value: false,
    category: "Compliance",
  },
  {
    settingName: "Enable Dark Mode",
    settingDescription: "Allow users to switch to dark theme",
    settingIcon: "🌙",
    value: true,
    category: "UI",
  },
];

export const initialModulePermissions: ModulePermissions = {
  employee: {
    owner: {
      view: true,
      edit: true,
      delete: false,
      approve: false,
      fourEyeEnabled: true,
      approverRole: "hr-manager",
    },
    manager: {
      view: true,
      edit: true,
      delete: false,
      approve: true,
      fourEyeEnabled: true,
      approverRole: "hr-manager",
    },
    hr: {
      view: true,
      edit: true,
      delete: true,
      approve: true,
      fourEyeEnabled: true,
      approverRole: "department-head",
    },
  },
  assets: {
    admin: {
      view: true,
      edit: true,
      delete: true,
      approve: true,
      fourEyeEnabled: false,
      approverRole: "asset-manager",
    },
    manager: {
      view: true,
      edit: true,
      delete: false,
      approve: false,
      fourEyeEnabled: false,
      approverRole: "asset-manager",
    },
    employee: {
      view: true,
      edit: false,
      delete: false,
      approve: false,
      fourEyeEnabled: false,
    },
  },
  finance: {
    admin: {
      view: true,
      edit: true,
      delete: true,
      approve: true,
      fourEyeEnabled: true,
      approverRole: "finance-manager",
    },
    accountant: {
      view: true,
      edit: true,
      delete: false,
      approve: false,
      fourEyeEnabled: true,
    },
    employee: {
      view: true,
      edit: false,
      delete: false,
      approve: false,
      fourEyeEnabled: true,
    },
  },
  projects: {
    admin: {
      view: true,
      edit: true,
      delete: true,
      approve: true,
      fourEyeEnabled: true,
      approverRole: "project-manager",
    },
    manager: {
      view: true,
      edit: true,
      delete: false,
      approve: true,
      fourEyeEnabled: true,
      approverRole: "senior-manager",
    },
    member: {
      view: true,
      edit: false,
      delete: false,
      approve: false,
      fourEyeEnabled: false,
    },
  },
  crm: {
    admin: {
      view: true,
      edit: true,
      delete: true,
      approve: true,
      fourEyeEnabled: false,
      approverRole: "sales-director",
    },
    sales: {
      view: true,
      edit: true,
      delete: false,
      approve: false,
      fourEyeEnabled: false,
    },
    marketing: {
      view: true,
      edit: false,
      delete: false,
      approve: false,
      fourEyeEnabled: false,
    },
  },
  inventory: {
    admin: {
      view: true,
      edit: true,
      delete: true,
      approve: true,
      fourEyeEnabled: true,
      approverRole: "warehouse-manager",
    },
    stock_keeper: {
      view: true,
      edit: true,
      delete: false,
      approve: false,
      fourEyeEnabled: false,
    },
    viewer: {
      view: true,
      edit: false,
      delete: false,
      approve: false,
      fourEyeEnabled: false,
    },
  },
  payroll: {
    admin: {
      view: true,
      edit: true,
      delete: true,
      approve: true,
      fourEyeEnabled: true,
      approverRole: "finance-manager",
    },
    hr_payroll: {
      view: true,
      edit: true,
      delete: false,
      approve: true,
      fourEyeEnabled: true,
      approverRole: "hr-manager",
    },
    employee: {
      view: true,
      edit: false,
      delete: false,
      approve: false,
      fourEyeEnabled: false,
    },
  },
};
