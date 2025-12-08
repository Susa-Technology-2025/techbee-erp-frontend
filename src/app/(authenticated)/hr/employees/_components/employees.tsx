// "use client";

// import { useState, useMemo } from "react";
// import { useRouter } from "next/navigation";
// import {
//   Box,
//   Typography,
//   TextField,
//   InputAdornment,
//   Button,
//   Skeleton,
//   Alert,
//   Stack,
//   Pagination,
//   styled,
// } from "@mui/material";
// import { Search, Add } from "@mui/icons-material";
// import { EmployeeCard } from "./employee-card";
// import { useGetEmployeesQuery } from "@/app/(authenticated)/hr/_queries/employees";

// const PageContainer = styled(Box)({
//   position: "relative",
//   minHeight: "100vh",
//   "&::before": {
//     content: '""',
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundImage: "url(https://picsum.photos/1920/1080?image=1039)",
//     backgroundSize: "cover",
//     backgroundPosition: "center",
//     backgroundAttachment: "fixed",
//     zIndex: -1,
//   },
// });

// const ContentContainer = styled(Box)(({ theme }) => ({
//   borderRadius: 2,
//   padding: theme.spacing(4),
// }));

// export const EmployeesList = () => {
//   const router = useRouter();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [page, setPage] = useState(1);
//   const itemsPerPage = 8;

//   const {
//     data: allEmployees,
//     isLoading,
//     isError,
//     refetch,
//   } = useGetEmployeesQuery();

//   const filteredEmployees = useMemo(() => {
//     if (!allEmployees) return [];

//     return allEmployees.filter((employee) => {
//       const matchesSearch = searchTerm
//         ? `${employee.firstName} ${employee.lastName} ${employee.employeeCode} ${employee.email}`
//             .toLowerCase()
//             .includes(searchTerm.toLowerCase())
//         : true;

//       return matchesSearch;
//     });
//   }, [allEmployees, searchTerm]);

//   const paginatedEmployees = useMemo(() => {
//     const startIndex = (page - 1) * itemsPerPage;
//     return filteredEmployees.slice(startIndex, startIndex + itemsPerPage);
//   }, [filteredEmployees, page]);

//   const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

//   const handleNavigateToNewEmployee = () => {
//     router.push("/hr/employees/new");
//   };

//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchTerm(e.target.value);
//     setPage(1);
//   };

//   const handlePageChange = (
//     event: React.ChangeEvent<unknown>,
//     newPage: number
//   ) => {
//     setPage(newPage);
//   };

//   if (isError) {
//     return (
//       <PageContainer>
//         <ContentContainer>
//           <Alert severity="error">
//             Failed to load employees. Please try again later.
//           </Alert>
//           <Button onClick={refetch} sx={{ mt: 2 }}>
//             Retry
//           </Button>
//         </ContentContainer>
//       </PageContainer>
//     );
//   }

//   return (
//     <PageContainer>
//       <ContentContainer>
//         <Stack
//           direction="row"
//           justifyContent="space-between"
//           alignItems="center"
//           mb={3}
//         >
//           <TextField
//             placeholder="Search employees..."
//             variant="outlined"
//             size="small"
//             value={searchTerm}
//             onChange={handleSearchChange}
//             sx={{
//               width: 500,
//               backgroundColor: "rgba(255, 255, 255, 0.7)",
//               borderRadius: 2,
//             }}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <Search />
//                 </InputAdornment>
//               ),
//             }}
//           />
//           <Button
//             variant="contained"
//             startIcon={<Add />}
//             onClick={handleNavigateToNewEmployee}
//             sx={{
//               borderRadius: "12px",
//               textTransform: "none",
//               px: 3,
//               py: 1,
//               background: "linear-gradient(135deg, #3f51b5 0%, #2196f3 100%)",
//               boxShadow: "0 4px 12px rgba(33, 150, 243, 0.2)",
//               "&:hover": {
//                 boxShadow: "0 6px 16px rgba(33, 150, 243, 0.3)",
//               },
//             }}
//           >
//             New Employee
//           </Button>
//         </Stack>

//         {isLoading ? (
//           <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
//             {[...Array(itemsPerPage)].map((_, index) => (
//               <Skeleton
//                 key={index}
//                 variant="rectangular"
//                 width={300}
//                 height={320}
//                 sx={{
//                   borderRadius: "16px",
//                   backgroundColor: "rgba(255, 255, 255, 0.4)",
//                 }}
//               />
//             ))}
//           </Box>
//         ) : filteredEmployees.length > 0 ? (
//           <>
//             <Box
//               sx={{
//                 display: "flex",
//                 flexWrap: "wrap",
//                 gap: 3,
//                 justifyContent: { xs: "center", sm: "flex-start" },
//                 mb: 3,
//               }}
//             >
//               {paginatedEmployees.map((employee: any) => (
//                 <EmployeeCard key={employee.id} employee={employee} />
//               ))}
//             </Box>
//             <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
//               <Pagination
//                 count={totalPages}
//                 page={page}
//                 onChange={handlePageChange}
//                 color="primary"
//                 shape="rounded"
//                 showFirstButton
//                 showLastButton
//                 sx={{
//                   "& .MuiPaginationItem-root": {
//                     backgroundColor: "rgba(255, 255, 255, 0.7)",
//                     "&.Mui-selected": {
//                       background:
//                         "linear-gradient(135deg, #3f51b5 0%, #2196f3 100%)",
//                       color: "white",
//                     },
//                   },
//                 }}
//               />
//             </Box>
//           </>
//         ) : (
//           <Box
//             sx={{
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//               justifyContent: "center",
//               height: 300,
//               textAlign: "center",
//               backgroundColor: "rgba(255, 255, 255, 0.5)",
//               borderRadius: 4,
//               p: 4,
//             }}
//           >
//             <Typography variant="h6" gutterBottom>
//               {searchTerm
//                 ? "No matching employees found"
//                 : "No employees available"}
//             </Typography>
//             <Typography variant="body1" color="text.secondary">
//               {searchTerm
//                 ? "Try a different search term"
//                 : "Add a new employee to get started"}
//             </Typography>
//           </Box>
//         )}
//       </ContentContainer>
//     </PageContainer>
//   );
// };
