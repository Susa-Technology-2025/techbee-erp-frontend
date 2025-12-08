import type { AgentResult } from "./types";

export function mockResults(q: string): AgentResult[] {
  const bedsMatch = q.match(/(\d+)\s*bed/i);
  const areaMatch = q.match(/\b(austin|miami|seattle|dallas|new york|denver)\b/i);
  const budgetMatch = q.match(/under\s*\$?([\d\.]+)\s*m/i);

  const beds = bedsMatch ? Number(bedsMatch[1]) : 3;
  const area = (areaMatch?.[1] || "Austin").replace(/^\w/, s => s.toUpperCase());
  const price = budgetMatch ? `$${budgetMatch[1]}M` : "$0.95M";

  return [
    { id: "LST-2001", title: `${beds}-Bed Apartment • ${area}`, price, beds, baths: Math.max(2, Math.min(3, beds - 1)), area, why: "Matches your filters" },
    { id: "LST-2013", title: `${beds}-Bed Condo • ${area} Downtown`, price: budgetMatch ? `$${Math.max(0.8, Number(budgetMatch[1]) - 0.1)}M` : "$0.9M", beds, baths: Math.max(2, Math.min(3, beds - 1)), area: `${area} Downtown`, why: "Close to amenities, newer build" },
  ];
}

export function mockListingById(id: string) {
  const base = { 
    id, 
    title: "Modern Luxury Home", 
    beds: 4, 
    baths: 3, 
    area: "Austin", 
    price: "$1.2M",
    description: "Spacious home near parks and schools.", 
    sqft: 2850, 
    year: 2022 
  };
  return base;
}

export function mockSlots(days = 3, hours = [10, 14, 17]) {
  const now = new Date();
  const slots: string[] = [];
  for (let d = 1; d <= days; d++) {
    for (const h of hours) {
      const x = new Date(now);
      x.setDate(now.getDate() + d);
      x.setHours(h, 0, 0, 0);
      slots.push(x.toISOString());
      if (slots.length >= 6) break;
    }
    if (slots.length >= 6) break;
  }
  return slots;
}


// import type { AgentResult } from "./types";

// const modules = [
//   { 
//     id: "MOD-001", 
//     name: "HR & Payroll", 
//     description: "Manage employees, attendance, salaries, and payroll processing.", 
//     keywords: ["employee", "staff", "salary", "payroll", "attendance", "leave"]
//   },
//   { 
//     id: "MOD-002", 
//     name: "Finance & Accounting", 
//     description: "Handle invoices, expenses, budgeting, and financial reports.", 
//     keywords: ["invoice", "billing", "accounting", "expense", "budget", "tax"]
//   },
//   { 
//     id: "MOD-003", 
//     name: "Inventory & Supply Chain", 
//     description: "Track stock, purchases, sales, and supplier relationships.", 
//     keywords: ["inventory", "stock", "warehouse", "supply", "purchase", "sales"]
//   },
//   { 
//     id: "MOD-004", 
//     name: "CRM", 
//     description: "Customer management, sales tracking, and support handling.", 
//     keywords: ["customer", "client", "crm", "lead", "sales", "support"]
//   },
//   { 
//     id: "MOD-005", 
//     name: "Project Management", 
//     description: "Plan, assign, and track project tasks and milestones.", 
//     keywords: ["project", "task", "milestone", "team", "plan", "deadline"]
//   }
// ];

// export function mockResults(q: string): AgentResult[] {
//   q = q.toLowerCase();

//   // Find modules that match keywords
//   const matchedModules = modules.filter(m =>
//     m.keywords.some(k => q.includes(k))
//   );

//   if (matchedModules.length === 0) {
//     // fallback: show all modules if no match
//     return modules.map(m => ({
//       id: m.id,
//       title: m.name,
//       description: m.description,
//       why: "Part of our ERP system"
//     }));
//   }

//   return matchedModules.map(m => ({
//     id: m.id,
//     title: m.name,
//     description: m.description,
//     why: "Matches your request"
//   }));
// }

// export function mockListingById(id: string) {
//   const module = modules.find(m => m.id === id);
//   if (!module) {
//     return { id, title: "Unknown Module", description: "Not found." };
//   }
//   return {
//     id: module.id,
//     title: module.name,
//     description: module.description,
//     services: [
//       "Step 1: Onboarding",
//       "Step 2: Training",
//       "Step 3: Full module access"
//     ],
//     subscriptionPlans: [
//       { name: "Basic", price: "$49/mo", features: ["Core features", "Email support"] },
//       { name: "Pro", price: "$99/mo", features: ["Advanced features", "Priority support"] },
//       { name: "Enterprise", price: "Custom", features: ["All features", "Dedicated manager"] }
//     ]
//   };
// }

// export function mockSlots(days = 3, hours = [10, 14, 17]) {
//   // For ERP: use this for demo scheduling
//   const now = new Date();
//   const slots: string[] = [];
//   for (let d = 1; d <= days; d++) {
//     for (const h of hours) {
//       const x = new Date(now);
//       x.setDate(now.getDate() + d);
//       x.setHours(h, 0, 0, 0);
//       slots.push(x.toISOString());
//       if (slots.length >= 6) break;
//     }
//     if (slots.length >= 6) break;
//   }
//   return slots;
// }
