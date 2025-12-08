export type AgentResult = {
    id: string; title: string; price: string;
    beds: number; baths: number; area: string; why?: string;
  };
  
  export type AgentResponse = {
    reply: string;
    results: AgentResult[];
    suggestions: string[];
    slots: string[]; // ISO datetimes
  };
  
  // optional context you can send from pages
  export type AgentContext =
    | { page: "home"; q?: string }
    | { page: "listing"; listingId: string; title?: string; area?: string; beds?: number; baths?: number; price?: string };
  
    export type Lead = {
      id: string; userKey?: string; name?: string; email?: string; phone?: string;
      budgetMin?: number; budgetMax?: number; beds?: number; baths?: number;
      areas?: string[]; timeline?: string; financing?: string; createdAt: string;
    };


    // A module or service result returned by the agent
// export type AgentResult = {
//   id: string;
//   title: string;            // Module name (e.g. "HR & Payroll")
//   description: string;      // What the module does
//   why?: string;             // Why it was suggested
// };

// // Full response from the agent
// export type AgentResponse = {
//   reply: string;            // Natural language answer to the user
//   results: AgentResult[];   // Matching ERP modules/services
//   suggestions: string[];    // Suggested next questions
//   slots: string[];          // Available demo/trial booking times (ISO datetimes)
// };

// // Context you can send to the agent from pages
// export type AgentContext =
//   | { page: "home"; q?: string }
//   | { page: "module"; moduleId: string; title?: string; description?: string };

// // Lead/contact info when user shows interest
// export type Lead = {
//   id: string;
//   userKey?: string;
//   name?: string;
//   email?: string;
//   phone?: string;
//   companySize?: string;       // e.g. "small", "mid", "enterprise"
//   industry?: string;          // e.g. "retail", "manufacturing"
//   interestedModules?: string[]; // list of module IDs
//   planPreference?: string;    // Basic / Pro / Enterprise
//   createdAt: string;
// };
