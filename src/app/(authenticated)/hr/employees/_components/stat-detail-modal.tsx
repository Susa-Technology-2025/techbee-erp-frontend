// "use client";
// import { useState } from "react";
// import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import { MaterialTableWrapper } from "@/components/MaterialTableWrapper";
// import { OnboardingPlanCreateInputSchema } from "@/lib/schemas/recruitment/onboarding-plan";

// interface Props {
//   open: boolean;
//   onClose: () => void;
//   endpoint: string;
//   schema: any;
//   title?: string;
// }

// export function ReusableModalTable({
//   open,
//   onClose,
//   endpoint,
//   schema,
//   title = "Table",
// }: Props) {
//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//       <DialogTitle className="flex justify-between items-center">
//         {title}
//         <IconButton onClick={onClose}>
//           <CloseIcon />
//         </IconButton>
//       </DialogTitle>
//       <DialogContent>
//         <MaterialTableWrapper endpoint={endpoint} schema={schema} />
//       </DialogContent>
//     </Dialog>
//   );
// }

// export default function Page() {
//   const [open, setOpen] = useState(false);

//   return (
//     <div className="p-6">
//       <button
//         onClick={() => setOpen(true)}
//         className="px-4 py-2 bg-blue-600 text-white rounded-lg"
//       >
//         Open Modal Table
//       </button>

//       <ReusableModalTable
//         open={open}
//         schema={OnboardingPlanCreateInputSchema}
//         onClose={() => setOpen(false)}
//         endpoint="https://api.techbee.et/api/hr/onboardingTaskAssignments"
//         title="Onboarding Task Assignments"
//       />
//     </div>
//   );
// }
