export function generatePageIndex(): any[] {
  return [
    // Root
    { path: "/about", title: "About" },
    { path: "/apps", title: "Apps" },
    { path: "/how-to", title: "How To" },
    { path: "/packages", title: "Packages" },
    { path: "/why-us", title: "Why Us" },

    // Auth
    { path: "/auth", title: "Register Organization" },
    { path: "/auth", title: "Sign In" },
    { path: "/auth", title: "Sign Up" },

    // Dashboard
    { path: "/dashboard", title: "Dashboard" },
    {
      path: "/settings/org",
      title: "Organization Settings",
    },
    {
      path: "/settings/org/approval-policy",
      title: "Approval Policy",
    },
    {
      path: "/settings/org/approval-steps",
      title: "Approval Steps",
    },
    {
      path: "/settings/org/structure",
      title: "Organization Structure",
    },
    {
      path: "/settings/org/tree",
      title: "Organization Tree",
    },
    {
      path: "/dashboard/super-admin/organizations",
      title: "Super Admin Organizations",
    },

    // Employee Portal
    { path: "/employee-portal", title: " Self service Portal" },
    { path: "/employee-portal/attendance", title: "Self service Attendance" },
    { path: "/employee-portal/benefits", title: " Self serviceBenefits" },
    { path: "/employee-portal/documents", title: " Self service Documents" },
    { path: "/employee-portal/exits", title: " Self service Exits" },
    { path: "/employee-portal/leaves", title: " Self service Leaves" },
    { path: "/employee-portal/payslips", title: "Self service Payslips" },
    {
      path: "/employee-portal/personal-info",
      title: " Self service Personal Info",
    },
    { path: "/employee-portal/survey", title: " Self service Survey" },
    {
      path: "/employee-portal/training-performance",
      title: "Training Performance",
    },

    // HR
    { path: "/hr/employees", title: "Employees" },
    // { path: "/employees", title: "Employees Next Version" },
    { path: "/hr/employees/contracts", title: "Employee Contracts" },
    { path: "/hr/attendance/leave-types", title: "Leave Types" },
    // { path: "/hr/hub", title: "HR Hub" },
    // { path: "/hr/hub/benefit-plans", title: "Benefit Plans" },
    // { path: "/hr/hub/claim-requests", title: "Claim Requests" },
    // { path: "/hr/hub/development-plan", title: "Development Plan" },
    // { path: "/hr/hub/disp-action", title: "Disciplinary Action" },
    // { path: "/hr/hub/documents", title: "HR Documents" },
    // { path: "/hr/hub/employee-benefit", title: "Employee Benefits" },
    // { path: "/hr/hub/goal", title: "Goals" },
    { path: "/hr/hub/internal-events", title: "Internal Events" },
    // { path: "/hr/hub/onboarding", title: "Onboarding" },
    // { path: "/hr/hub/performance-review", title: "Performance Review" },
    // { path: "/hr/hub/positions", title: "Positions" },
    // { path: "/hr/hub/shifts", title: "Shifts" },
    // { path: "/hr/hub/survey", title: "HR Surveys" },
    // { path: "/hr/hub/survey-response", title: "Survey Responses" },
    // { path: "/hr/hub/training-records", title: "Training Records" },
    { path: "/hr/payroll", title: "Payroll" },
    { path: "/hr/payroll/bank-accounts", title: "Bank Accounts" },
    { path: "/hr/payroll/payroll-batches", title: "Payroll Batches" },
    { path: "/hr/payroll/payslip-components", title: "Payslip Components" },
    { path: "/hr/payroll/payslip-inputs", title: "Payslip Inputs" },
    { path: "/hr/payroll/payslips", title: "Payslips" },
    { path: "/hr/payroll/work-entries", title: "Work Entries" },
    { path: "/hr/attendance", title: "HR Attendance" },
    { path: "/hr/attendance/exits", title: "Attendance Exits" },
    { path: "/hr/attendance/leave-requests", title: "Leave Requests" },
    { path: "/hr/attendance/leave-types", title: "Leave Types" },
    { path: "/hr/attendance/time-off-types", title: "Time Off Types" },

    { path: "/hr/payroll/settings", title: "Payroll Settings" },
    {
      path: "/hr/payroll/settings/salary-rule-category",
      title: "Salary Rule Categories",
    },
    { path: "/hr/payroll/settings/salary-rules", title: "Salary Rules" },
    {
      path: "/hr/payroll/settings/salary-structure",
      title: "Salary Structures",
    },
    {
      path: "/hr/payroll/settings/salary-structure-rules",
      title: "Salary Structure Rules",
    },
    {
      path: "/hr/payroll/tax-bracket",
      title: "Tax Bracket",
    },
    // {
    //   path: "/hr/payroll/deduction-policy",
    //   title: "Deduction Policy",
    // },
    {
      path: "/hr/payroll/pension-policy",
      title: "Pension Policy",
    },

    // Inventory
    { path: "/scm/inventory", title: "Inventory" },
    // {
    //   path: "/inventory/inventory-adjustments",
    //   title: "Inventory Adjustments",
    // },
    // {
    //   path: "/inventory/inventory-adjustment-lines",
    //   title: "Adjustment Lines",
    // },
    // { path: "/inventory/landed-costs", title: "Landed Costs" },
    // { path: "/inventory/landed-cost-lines", title: "Landed Cost Lines" },
    // { path: "/inventory/procurement-rules", title: "Procurement Rules" },
    // { path: "/inventory/products", title: "Products" },
    // { path: "/inventory/product-attributes", title: "Product Attributes" },
    // { path: "/inventory/product-attribute-values", title: "Attribute Values" },
    // { path: "/inventory/product-categories", title: "Product Categories" },
    // { path: "/inventory/product-tags", title: "Product Tags" },
    // { path: "/inventory/product-variants", title: "Product Variants" },
    // { path: "/inventory/reordering-rules", title: "Reorder Rules" },
    // { path: "/inventory/scraps", title: "Scraps" },
    // { path: "/inventory/stock-locations", title: "Stock Locations" },
    // { path: "/inventory/stock-lots", title: "Stock Lots" },
    // { path: "/inventory/stock-moves", title: "Stock Moves" },
    // { path: "/inventory/stock-pickings", title: "Stock Pickings" },
    // { path: "/inventory/stock-quants", title: "Stock Quants" },
    // { path: "/inventory/stock-valuation-layers", title: "Valuation Layers" },
    // { path: "/inventory/supplier-infos", title: "Supplier Info" },
    // { path: "/inventory/tags", title: "Tags" },
    // { path: "/inventory/unit-of-measures", title: "Units of Measure" },
    // { path: "/inventory/unit-of-measure-categories", title: "UoM Categories" },
    // { path: "/inventory/warehouses", title: "Warehouses" },

    // POS
    { path: "/pos", title: "Point of Sale" },
    { path: "/pos/clothes", title: "Clothes" },
    { path: "/pos/kitchen-orders", title: "Kitchen Orders" },
    { path: "/pos/kitchen-order-items", title: "Kitchen Order Items" },
    { path: "/pos/payments", title: "Payments" },
    { path: "/pos/pos-configurations", title: "POS Configurations" },
    { path: "/pos/pos-floors", title: "POS Floors" },
    { path: "/pos/pos-payment-methods", title: "Payment Methods" },
    { path: "/pos/pos-product-categories", title: "Product Categories" },
    { path: "/pos/pos-product-configs", title: "Product Configs" },
    { path: "/pos/pos-sessions", title: "POS Sessions" },
    { path: "/pos/promotions", title: "Promotions" },
    { path: "/pos/sales-items", title: "Sales Items" },
    { path: "/pos/sales-transactions", title: "Sales Transactions" },
    { path: "/pos/tables", title: "Tables" },

    // Users
    { path: "/settings/users", title: "/Users" },
    { path: "/settings/users/node-assignment", title: "Node Assignment" },
    { path: "/settings/users/permissions", title: "Permissions" },
    { path: "/settings/users/role-permission", title: "Role Permissions" },
    { path: "/settings/users/roles", title: "Roles" },
    { path: "/settings/users/user-role", title: "User Roles" },
    { path: "/settings/users/users", title: "User Management" },

    // Others
    { path: "/verify-document", title: "Verify Document" },
    { path: "/test", title: "Test Page" },
  ];
}
