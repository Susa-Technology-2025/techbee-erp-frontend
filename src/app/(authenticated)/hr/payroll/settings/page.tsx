// "use client";

// import React from "react";
// import {
//   Box,
//   Typography,
//   Button,
//   Card,
//   CardContent,
//   Stack,
//   Divider,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   TextField,
// } from "@mui/material";
// import {
//   CalendarToday,
//   AccountBalance,
//   Favorite,
//   Description,
//   Edit,
//   Settings as SettingsIcon,
//   Save,
//   Flag,
//   LocationCity,
//   Map,
//   FileUpload,
//   Category,
//   Rule,
//   Layers,
//   PlaylistAddCheck,
//   CheckCircle as CheckCircleIcon,
//   Edit as PenIcon,
// } from "@mui/icons-material";
// import RuleCategoryCard from './_components/rule-category/rule-category-card';
// import { CardType } from './_components/rule-category/rule-category-types';
// import SmartCrudModal, { useSmartCrudModal, FieldConfig } from '../../../../components/smart-crud/modal-dialog';
// import { ruleCategoryFields } from './_components/rule-category/schema-examples';
// import { ruleCategoryZodSchema } from './_components/rule-category/rule-category-zod';
// import {
//   useGetSalaryrulecategoriesQuery,
//   useCreateSalaryrulecategoriesMutation,
//   useUpdateSalaryrulecategoriesMutation,
//   useDeleteSalaryrulecategoriesMutation,
// } from "../_queries/salaryRuleCategories";
// import {
//   useGetSalaryrulesQuery,
//   useCreateSalaryrulesMutation,
//   useUpdateSalaryrulesMutation,
//   useDeleteSalaryrulesMutation,
// } from "../_queries/salaryRules";
// import { SalaryRuleCard } from './_components/salary-rules/SalaryRuleCard';
// import { SalaryRule, salaryRuleSchema, validateSalaryRule } from './_components/salary-rules/salary-rules';
// import { salaryRuleFields } from './fields/salary-rule-fields';
// import StructureCard from './_components/structures/structures-card';
// import { structureSchema } from './_components/structures/structure-schema';
// import { getFieldConfigs } from './_components/structures/structure-field';
// import StructureRuleCard from './_components/structure-rule/structure-rule-card';
// import { structureRuleSchema } from './_components/structure-rule/structure-rule-schema';
// import { getFieldConfigs as getStructureRuleFieldConfigs } from './_components/structure-rule/structure-rule-field';
// import BatchCard from './_components/payroll-batch/batch-card';
// import { batchSchema } from './_components/payroll-batch/batch-schema';
// import { getFieldConfigs as getBatchFieldConfigs } from './_components/payroll-batch/batch-field';
// // Type for SmartCrudModal that ensures id is always a string
// type SalaryRuleWithId = SalaryRule & { id: string };

// import { z } from "zod";
// import dayjs from "dayjs";
// import { useCreateSalarystructuresMutation, useDeleteSalarystructuresMutation, useGetSalarystructuresQuery, useUpdateSalarystructuresMutation } from "../_queries/salaryStructures";
// import { useGetSalarystructurerulesQuery, useCreateSalarystructurerulesMutation, useUpdateSalarystructurerulesMutation, useDeleteSalarystructurerulesMutation } from "../_queries/salaryStructureRules";
// import { useGetPayrollbatchesQuery, useCreatePayrollbatchesMutation, useUpdatePayrollbatchesMutation, useDeletePayrollbatchesMutation } from "../_queries/payrollBatches";
// // Schema for SmartCrudModal that requires id

// // Custom validation function for better error messages
// const validateSalaryRuleForModal = (data: any) => {
//   console.log('Validating salary rule data:', data);
//   const result = validateSalaryRule(data);
//   console.log('Validation result:', result);

//   if (!result.success) {
//     // Convert our custom error format to Zod format
//     return {
//       success: false,
//       error: {
//         issues: result.error.issues.map((issue: any) => ({
//           code: issue.code,
//           message: issue.message,
//           path: issue.path
//         }))
//       }
//     };
//   }
//   return result;
// };

// // Custom validation function for Structure Rules
// const validateStructureRuleForModal = (data: any) => {
//   console.log('Validating structure rule data:', data);
//   console.log('salaryStructure value:', data.salaryStructure);
//   console.log('salaryRule value:', data.salaryRule);

//   // Handle both object and string formats
//   const salaryStructureId = typeof data.salaryStructure === 'object' ? data.salaryStructure?.id : data.salaryStructure;
//   const salaryRuleId = typeof data.salaryRule === 'object' ? data.salaryRule?.id : data.salaryRule;

//   // Transform to nested object structure
//   const transformedData = {
//     id: data.id || undefined, // Handle missing id for new items
//     sequence: data.sequence,
//     salaryStructure: { id: salaryStructureId },
//     salaryRule: { id: salaryRuleId }
//   };

//   console.log('Transformed data:', transformedData);

//   // Validate with the schema
//   const result = structureRuleSchema.safeParse(transformedData);

//   if (!result.success) {
//     return {
//       success: false,
//       error: {
//         issues: result.error.errors.map((error: any) => ({
//           code: error.code,
//           message: error.message,
//           path: error.path
//         }))
//       }
//     };
//   }

//   return {
//     success: true,
//     data: transformedData // Return the transformed data for the backend
//   };
// };

// // Custom validation function for Payroll Batches
// const validateBatchForModal = (data: any) => {
//   console.log('Validating batch data:', data);

//   // Ensure dates are in the correct format
//   const transformedData = {
//     ...data,
//     periodStart: data.periodStart ? dayjs(data.periodStart).format('YYYY-MM-DDTHH:mm') : data.periodStart,
//     periodEnd: data.periodEnd ? dayjs(data.periodEnd).format('YYYY-MM-DDTHH:mm') : data.periodEnd,
//   };

//   console.log('Transformed batch data:', transformedData);

//   // Validate with the schema
//   const result = batchSchema.safeParse(transformedData);

//   if (!result.success) {
//     return {
//       success: false,
//       error: {
//         issues: result.error.errors.map((error: any) => ({
//           code: error.code,
//           message: error.message,
//           path: error.path
//         }))
//       }
//     };
//   }

//   return {
//     success: true,
//     data: transformedData // Return the transformed data for the backend
//   };
// };

// const payrollConfigCards = [
//   {
//     icon: <Category fontSize="large" />, // Rule Categories
//     title: "Rule Categories",
//     desc: "Categorize compensation components for organized management and reporting.",
//     button: { label: "Configure", variant: "contained", icon: <Edit /> },
//   },
//   {
//     icon: <Rule fontSize="large" />, // Salary Rules
//     title: "Salary Rules",
//     desc: "Define atomic calculation rules with multiple computation strategies.",
//     button: { label: "Configure", variant: "contained", icon: <Edit /> },
//   },
//   {
//     icon: <Layers fontSize="large" />, // Structures
//     title: "Structures",
//     desc: "Combine rules into enforceable compensation policies and templates.",
//     button: { label: "Configure", variant: "contained", icon: <Edit /> },
//   },
//   {
//     icon: <PlaylistAddCheck fontSize="large" />, // Structure Rules
//     title: "Structure Rules",
//     desc: "Sequence and compose rules with precise execution order control.",
//     button: { label: "Configure", variant: "contained", icon: <Edit /> },
//   },
// ];

// const payrollBatchConfig = {
//   icon: <AccountBalance fontSize="large" />,
//   title: "Payroll Batches",
//   desc: "Create, monitor, and manage payroll processing batches for different periods and employee groups.",
//   status: "active",
//   button: { label: "Manage", variant: "contained", icon: <Edit /> },
// };

// export default function PayrollSettingsPage() {
//   const [paySchedule, setPaySchedule] = React.useState("Bi-weekly (every 2 weeks)");
//   const [approvalProcess, setApprovalProcess] = React.useState("Single-level approval");
//   const [paymentMethod, setPaymentMethod] = React.useState("Direct Deposit");
//   const [lockDate, setLockDate] = React.useState("2023-08-15");
//   const [nextPayDate, setNextPayDate] = React.useState("2023-08-31");

//   // Use the custom hook for modal state
//   const { open: modalOpen, handleOpen: handleOpenModal, handleClose: handleCloseModal } = useSmartCrudModal();

//   // Use the custom hook for salary rules modal state
//   const {
//     open: salaryRulesModalOpen,
//     handleOpen: handleOpenSalaryRulesModal,
//     handleClose: handleCloseSalaryRulesModal
//   } = useSmartCrudModal();

//   // Use the custom hook for structures modal state
//   const {
//     open: structuresModalOpen,
//     handleOpen: handleOpenStructuresModal,
//     handleClose: handleCloseStructuresModal
//   } = useSmartCrudModal();

//   // Use the custom hook for structure rules modal state
//   const {
//     open: structureRulesModalOpen,
//     handleOpen: handleOpenStructureRulesModal,
//     handleClose: handleCloseStructureRulesModal
//   } = useSmartCrudModal();

//   // Use the custom hook for payroll batches modal state
//   const {
//     open: payrollBatchesModalOpen,
//     handleOpen: handleOpenPayrollBatchesModal,
//     handleClose: handleClosePayrollBatchesModal
//   } = useSmartCrudModal();

//   return (
//     <Box
//       sx={{
//         minWidth: 0,
//         mx: "auto",
//         my: { xs: 2, md: 4 },
//         bgcolor: "background.default",
//         borderRadius: 3,
//         boxShadow: 3,
//         minHeight: "90vh",
//         p: { xs: 2, md: 5 },
//       }}
//     >
//       {/* Header */}
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           mb: 4,
//           pb: 1,
//           borderBottom: 1,
//           borderColor: "divider",
//         }}
//       >
//         <Typography variant="h6" fontWeight={700} color="primary.dark" display="flex" alignItems="center" gap={1.5}>
//           <SettingsIcon color="primary" /> Payroll Settings
//         </Typography>
//         {/* <Box display="flex" alignItems="center" gap={1.5} bgcolor="grey.100" px={2} py={1} borderRadius={10}>
//           <Avatar sx={{ bgcolor: "primary.main", width: 36, height: 36, fontWeight: 600, fontSize: "0.9rem" }}>AD</Avatar>
//           <Typography fontWeight={500}>Admin User</Typography>
//         </Box> */}
//       </Box>

//       {/* Payroll Configuration Section */}
//       <Box mb={6}>
//         <Box mb={3}>
//           <Typography variant="h6" fontWeight={400} color="primary.dark" mb={0.5}>
//             Payroll Configuration
//           </Typography>
//           <Typography color="text.secondary">
//             Manage core payroll settings and preferences for your organization
//           </Typography>
//         </Box>
//         <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }} gap={3}>
//           {payrollConfigCards.map((card, idx) => (
//             <Box key={card.title}>
//                               <Card
//                   sx={{
//                     borderRadius: 2,
//                     border: 1,
//                     borderColor: "divider",
//                     height: "100%",
//                     display: "flex",
//                     flexDirection: "column",
//                     transition: "transform 0.3s, box-shadow 0.3s",
//                     cursor: (card.title === 'Rule Categories' || card.title === 'Salary Rules') ? 'pointer' : 'default',
//                     // '&:hover': {
//                     //   transform: "translateY(-5px)",
//                     //   boxShadow: 6,
//                     //   borderColor: "primary.light",
//                     // },
//                   }}
//                   onClick={
//                     card.title === 'Rule Categories' ? handleOpenModal :
//                     card.title === 'Salary Rules' ? handleOpenSalaryRulesModal :
//                     card.title === 'Structures' ? handleOpenStructuresModal :
//                     card.title === 'Structure Rules' ? handleOpenStructureRulesModal :
//                     undefined
//                   }
//                 >
//                 <CardContent sx={{ display: "flex", flexDirection: "column", height: "100%", p: 3 }}>
//                   <Box
//                     sx={{
//                       width: 56,
//                       height: 56,
//                       borderRadius: 2,
//                       bgcolor: "primary.50",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       mb: 2.5,
//                       color: "primary.main",
//                       fontSize: 32,
//                     }}
//                   >
//                     {card.icon}
//                   </Box>
//                   <Typography variant="h6" fontWeight={700} mb={1} color="primary.dark">
//                     {card.title}
//                   </Typography>
//                   <Typography color="text.secondary" fontSize={15} mb={2} flexGrow={1}>
//                     {card.desc}
//                   </Typography>
//                   <Divider sx={{ my: 1.5 }} />
//                   <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
//                     <Button
//                       variant={card.button.variant as any}
//                       size="small"
//                       startIcon={card.button.icon}
//                       sx={{ fontWeight: 600, borderRadius: 2, px: 2, py: 0.5 }}
//                       onClick={
//                         card.title === 'Rule Categories' ? handleOpenModal :
//                         card.title === 'Salary Rules' ? handleOpenSalaryRulesModal :
//                         card.title === 'Structures' ? handleOpenStructuresModal :
//                         card.title === 'Structure Rules' ? handleOpenStructureRulesModal :
//                         undefined
//                       }
//                     >
//                       {card.button.label}
//                     </Button>
//                   </Box>
//                 </CardContent>
//               </Card>
//             </Box>
//           ))}
//         </Box>
//       </Box>

//       {/* Payroll Batch Configuration Section */}
//       <Box mb={6}>
//         <Box mb={3}>
//           <Typography variant="h6" fontWeight={400} color="primary.dark" mb={0.5}>
//             Payroll Batch Configuration
//           </Typography>
//           <Typography color="text.secondary">
//             Manage payroll processing batches and batch settings
//           </Typography>
//         </Box>
//         <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }} gap={3}>
//           <Box>
//             <Card
//               sx={{
//                 borderRadius: 2,
//                 border: 1,
//                 borderColor: "divider",
//                 height: "100%",
//                 display: "flex",
//                 flexDirection: "column",
//                 transition: "transform 0.3s, box-shadow 0.3s",
//                 cursor: 'pointer',
//                 // '&:hover': {
//                 //   transform: "translateY(-5px)",
//                 //   boxShadow: 6,
//                 //   borderColor: "primary.light",
//                 // },
//               }}
//             >
//               <CardContent sx={{ display: "flex", flexDirection: "column", height: "100%", p: 3 }}>
//                 <Box
//                   sx={{
//                     width: 56,
//                     height: 56,
//                     borderRadius: 2,
//                     bgcolor: "primary.50",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     mb: 2.5,
//                     color: "primary.main",
//                     fontSize: 32,
//                   }}
//                 >
//                   {payrollBatchConfig.icon}
//                 </Box>
//                 <Typography variant="h6" fontWeight={700} mb={1} color="primary.dark">
//                   {payrollBatchConfig.title}
//                 </Typography>
//                 <Typography color="text.secondary" fontSize={15} mb={2} flexGrow={1}>
//                   {payrollBatchConfig.desc}
//                 </Typography>
//                 <Divider sx={{ my: 1.5 }} />
//                 <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
//                   {/* <Box display="flex" alignItems="center" gap={1}>
//                     <Box
//                       sx={{
//                         width: 10,
//                         height: 10,
//                         borderRadius: "50%",
//                         bgcolor: payrollBatchConfig.status === "active" ? "success.main" : "error.main",
//                       }}
//                     />
//                     <Typography fontSize={13} fontWeight={500} color={payrollBatchConfig.status === "active" ? "success.main" : "error.main"}>
//                       {payrollBatchConfig.status === "active" ? "Active" : "Not Configured"}
//                     </Typography>
//                   </Box> */}
//                   <Button
//                     variant={payrollBatchConfig.button.variant as any}
//                     size="small"
//                     startIcon={payrollBatchConfig.button.icon}
//                     sx={{ fontWeight: 600, borderRadius: 2, px: 2, py: 0.5 }}
//                     onClick={handleOpenPayrollBatchesModal}
//                   >
//                     {payrollBatchConfig.button.label}
//                   </Button>
//                 </Box>
//               </CardContent>
//             </Card>
//           </Box>
//         </Box>
//       </Box>
//       {/*
//         SmartCrudModal Configuration Examples:

//                 // Current Rule Categories configuration (using imported schema and validation)
//         // import { ruleCategoryFields } from './_components/RuleCategory/schema-examples';
//         // import { ruleCategoryZodSchema } from './_components/RuleCategory/rule-category-zod';
//         <SmartCrudModal
//           fields={ruleCategoryFields}
//           zodSchema={ruleCategoryZodSchema}
//           isSearch={true}
//           haveAdd={true}
//           haveSelectAll={true}
//           haveTitle={true}
//         />

//         // Example: Employee configuration (using imported schema and validation)
//         // import { employeeFields } from './_components/RuleCategory/schema-examples';
//         // import { employeeZodSchema } from './_components/RuleCategory/rule-category-zod';
//         <SmartCrudModal
//           fields={employeeFields}
//           zodSchema={employeeZodSchema}
//           isSearch={true}
//           haveAdd={true}
//           haveSelectAll={true}
//           haveTitle={true}
//         />

//         // Example: Product configuration (using imported schema and validation)
//         // import { productFields } from './_components/RuleCategory/schema-examples';
//         // import { productZodSchema } from './_components/RuleCategory/rule-category-zod';
//         <SmartCrudModal
//           fields={productFields}
//           zodSchema={productZodSchema}
//           isSearch={true}
//           haveAdd={true}
//           haveSelectAll={true}
//           haveTitle={true}
//         />
//       */}
//       <SmartCrudModal<CardType>
//         title="Rule Categories"
//         CardComponent={RuleCategoryCard}
//         useQuery={useGetSalaryrulecategoriesQuery}
//         useCreate={useCreateSalaryrulecategoriesMutation}
//         useUpdate={useUpdateSalaryrulecategoriesMutation}
//         useDelete={useDeleteSalaryrulecategoriesMutation}
//         getItemDisplayName={item => item?.name || ''}
//         open={modalOpen}
//         onClose={handleCloseModal}
//         fields={ruleCategoryFields}
//         zodSchema={ruleCategoryZodSchema}
//         isSearch={true}
//         haveAdd={true}
//         haveSelectAll={true}
//         haveTitle={true}
//         haveExport={true}
//         onExport={() => {
//           // Replace with your export logic
//           alert('Export clicked!');
//         }}
//       />

//       {/* Salary Rules Modal */}
//       <SmartCrudModal<SalaryRuleWithId>
//         title="Salary Rules"
//         CardComponent={SalaryRuleCard}
//         useQuery={useGetSalaryrulesQuery}
//         useCreate={useCreateSalaryrulesMutation}
//         useUpdate={useUpdateSalaryrulesMutation}
//         useDelete={useDeleteSalaryrulesMutation}
//         getItemDisplayName={item => item?.name || ''}
//         open={salaryRulesModalOpen}
//         onClose={handleCloseSalaryRulesModal}
//         fields={salaryRuleFields}
//         customValidation={validateSalaryRuleForModal}
//         isSearch={true}
//         haveAdd={true}
//         haveSelectAll={true}
//         haveTitle={true}
//         haveExport={true}
//         onExport={() => {
//           // Replace with your export logic
//           alert('Export clicked!');
//         }}
//       />

//       {/* Structures Modal */}
//       <SmartCrudModal<any>
//         title="Salary Structures"
//         CardComponent={StructureCard}
//         useQuery={useGetSalarystructuresQuery}
//         useCreate={useCreateSalarystructuresMutation}
//         useUpdate={useUpdateSalarystructuresMutation}
//         useDelete={useDeleteSalarystructuresMutation}
//         getItemDisplayName={item => item?.name || ''}
//         open={structuresModalOpen}
//         onClose={handleCloseStructuresModal}
//         fields={getFieldConfigs()}
//         zodSchema={structureSchema}
//         isSearch={true}
//         haveAdd={true}
//         haveSelectAll={true}
//         haveTitle={true}
//         haveExport={true}
//         onExport={() => {
//           // Replace with your export logic
//           alert('Export clicked!');
//         }}
//       />

//       {/* Structure Rules Modal */}
//       <SmartCrudModal<any>
//         title="Structure Rules"
//         CardComponent={StructureRuleCard}
//         useQuery={useGetSalarystructurerulesQuery}
//         useCreate={useCreateSalarystructurerulesMutation}
//         useUpdate={useUpdateSalarystructurerulesMutation}
//         useDelete={useDeleteSalarystructurerulesMutation}
//         getItemDisplayName={item => `Rule ${item?.sequence || 0}`}
//         open={structureRulesModalOpen}
//         onClose={handleCloseStructureRulesModal}
//         fields={getStructureRuleFieldConfigs()}
//         customValidation={validateStructureRuleForModal}
//         isSearch={true}
//         haveAdd={true}
//         haveSelectAll={true}
//         haveTitle={true}
//         haveExport={true}
//         onExport={() => {
//           // Replace with your export logic
//           alert('Export clicked!');
//         }}
//       />

//       {/* Payroll Batches Modal */}
//       <SmartCrudModal<any>
//         title="Payroll Batches"
//         CardComponent={BatchCard}
//         useQuery={useGetPayrollbatchesQuery}
//         useCreate={useCreatePayrollbatchesMutation}
//         useUpdate={useUpdatePayrollbatchesMutation}
//         useDelete={useDeletePayrollbatchesMutation}
//         getItemDisplayName={item => item?.name || ''}
//         open={payrollBatchesModalOpen}
//         onClose={handleClosePayrollBatchesModal}
//         fields={getBatchFieldConfigs()}
//         customValidation={validateBatchForModal}
//         isSearch={true}
//         haveAdd={true}
//         haveSelectAll={true}
//         haveTitle={true}
//         haveExport={true}
//         onExport={() => {
//           // Replace with your export logic
//           alert('Export clicked!');
//         }}
//       />
//     </Box>
//   );
// }

export default () => {
  return null;
};
