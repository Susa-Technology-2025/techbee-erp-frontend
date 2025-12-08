// "use client";
// import React, { useState } from 'react';
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   Button,
//   IconButton,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Chip,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Stack,
//   useTheme,
//   alpha,
//   Divider
// } from '@mui/material';
// import {
//   TrendingUp,
//   TrendingDown,
//   Person,
//   AttachMoney,
//   Schedule,
//   Receipt,
//   Refresh,
//   FileDownload,
//   Print,
//   Settings,
//   Visibility,
//   PieChart as PieChartIcon,
//   BarChart,
//   ShowChart
// } from '@mui/icons-material';
// import { LineChart, Line, BarChart as RechartsBarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// // Mock data
// const statsData = [
//   {
//     title: 'Total Payroll',
//     value: '243,850 ETB',
//     icon: <AttachMoney />,
//     trend: '+12.4%',
//     trendDirection: 'up',
//     color: '#4361ee'
//   },
//   {
//     title: 'Employees',
//     value: '187',
//     icon: <Person />,
//     trend: '+3 new',
//     trendDirection: 'up',
//     color: '#3a0ca3'
//   },
//   {
//     title: 'Overtime Cost',
//     value: '18,430 ETB',
//     icon: <Schedule />,
//     trend: '-8.2%',
//     trendDirection: 'down',
//     color: '#4cc9f0'
//   },
//   {
//     title: 'Total Taxes',
//     value: '42,760 ETB',
//     icon: <Receipt />,
//     trend: '+5.3%',
//     trendDirection: 'up',
//     color: '#f72585'
//   }
// ];

// // Chart data
// const payrollTrendData = [
//   { month: 'Jan', value: 185 },
//   { month: 'Feb', value: 195 },
//   { month: 'Mar', value: 210 },
//   { month: 'Apr', value: 205 },
//   { month: 'May', value: 220 },
//   { month: 'Jun', value: 243 }
// ];

// const costDistributionData = [
//   { name: 'Salaries', value: 45, color: '#4361ee' },
//   { name: 'Overtime', value: 15, color: '#3a0ca3' },
//   { name: 'Benefits', value: 20, color: '#4cc9f0' },
//   { name: 'Taxes', value: 12, color: '#f72585' },
//   { name: 'Bonuses', value: 8, color: '#7209b7' }
// ];

// const taxBreakdownData = [
//   { name: 'Federal Income', value: 35, color: '#4361ee' },
//   { name: 'Social Security', value: 25, color: '#3a0ca3' },
//   { name: 'Medicare', value: 10, color: '#4cc9f0' },
//   { name: 'State Tax', value: 20, color: '#f72585' },
//   { name: 'Local Tax', value: 10, color: '#7209b7' }
// ];

// const overtimeData = [
//   { department: 'Engineering', cost: 8500 },
//   { department: 'Operations', cost: 3200 },
//   { department: 'Sales', cost: 4100 },
//   { department: 'Marketing', cost: 1800 },
//   { department: 'HR', cost: 830 }
// ];

// const tableData = [
//   {
//     employee: 'Sarah Johnson',
//     department: 'Engineering',
//     grossPay: '8,450.00 ETB',
//     taxes: '1,920.35 ETB',
//     deductions: '420.50 ETB',
//     netPay: '6,109.15 ETB',
//     paymentMethod: 'Direct Deposit',
//     status: 'Completed'
//   },
//   {
//     employee: 'Michael Chen',
//     department: 'Marketing',
//     grossPay: '6,250.00 ETB',
//     taxes: '1,418.75 ETB',
//     deductions: '310.00 ETB',
//     netPay: '4,521.25 ETB',
//     paymentMethod: 'Direct Deposit',
//     status: 'Completed'
//   },
//   {
//     employee: 'Emily Rodriguez',
//     department: 'Sales',
//     grossPay: '7,800.00 ETB',
//     taxes: '1,771.00 ETB',
//     deductions: '387.50 ETB',
//     netPay: '5,641.50 ETB',
//     paymentMethod: 'Paper Check',
//     status: 'Pending'
//   },
//   {
//     employee: 'David Kim',
//     department: 'Operations',
//     grossPay: '5,600.00 ETB',
//     taxes: '1,272.00 ETB',
//     deductions: '278.00 ETB',
//     netPay: '4,050.00 ETB',
//     paymentMethod: 'Direct Deposit',
//     status: 'Completed'
//   },
//   {
//     employee: 'Jennifer Thompson',
//     department: 'Human Resources',
//     grossPay: '6,750.00 ETB',
//     taxes: '1,533.75 ETB',
//     deductions: '335.00 ETB',
//     netPay: '4,881.25 ETB',
//     paymentMethod: 'Direct Deposit',
//     status: 'Completed'
//   }
// ];

// export default function PayrollReportPage() {
//   const theme = useTheme();
//   const [period, setPeriod] = useState('current');
//   const [department, setDepartment] = useState('all');

//   const StatCard = ({ data }: { data: typeof statsData[0] }) => (
//     <Card
//       sx={{
//         height: '100%',
//         position: 'relative',
//         '&::before': {
//           content: '""',
//           position: 'absolute',
//           top: 0,
//           left: 0,
//           width: '4px',
//           height: '100%',

//         //   backgroundColor: data.color
//         }
//       }}
//     >
//       <CardContent sx={{ p: 3 }}>
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//           <Box
//             sx={{
//               width: 48,
//               height: 48,
//               borderRadius: 2,
//               backgroundColor: alpha(data.color, 0.1),
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               color: data.color
//             }}
//           >
//             {data.icon}
//           </Box>
//           <Box sx={{ flex: 1 }}>
//             <Typography variant="h6" sx={{ fontWeight: 500, color: theme.palette.text.primary }}>
//               {data.value}
//             </Typography>
//             <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 1 }}>
//               {data.title}
//             </Typography>
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//               {data.trendDirection === 'up' ? (
//                 <TrendingUp sx={{ color: 'success.main', fontSize: 16 }} />
//               ) : (
//                 <TrendingDown sx={{ color: 'error.main', fontSize: 16 }} />
//               )}
//               <Typography
//                 variant="caption"
//                 sx={{
//                   color: data.trendDirection === 'up' ? 'success.main' : 'error.main',
//                   fontWeight: 600
//                 }}
//               >
//                 {data.trend}
//               </Typography>
//             </Box>
//           </Box>
//         </Box>
//       </CardContent>
//     </Card>
//   );

//   const ChartCard = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
//     <Card sx={{ height: 350, display: 'flex', flexDirection: 'column' }}>
//       <Box sx={{ p: 3, pb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//           <Box
//             sx={{
//               width: 40,
//               height: 40,
//               borderRadius: 2,
//               backgroundColor: alpha(theme.palette.primary.main, 0.1),
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               color: theme.palette.primary.main
//             }}
//           >
//             {icon}
//           </Box>
//           <Typography variant="h6" sx={{ fontWeight: 600 }}>
//             {title}
//           </Typography>
//         </Box>
//       </Box>
//       <Box sx={{ flex: 1, p: 2, pt: 0 }}>
//         {children}
//       </Box>
//     </Card>
//   );

//   return (
//     <Box sx={{ p: 3 }}>
//       {/* Header */}
//       <Box sx={{ mb: 3 }}>
//         <Typography variant="h5" color='background.primary' sx={{ fontWeight: 600, mb: 1 }}>
//           Payroll Report
//         </Typography>
//         <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
//           View and manage payroll data for the current period
//         </Typography>
//       </Box>

//       {/* Stats Cards */}
//       <Box sx={{ mb: 3 }}>
//         <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
//           {statsData.map((stat, index) => (
//             <Box key={index} sx={{ flex: '1 1 250px', minWidth: 250 }}>
//               <StatCard data={stat} />
//             </Box>
//           ))}
//         </Box>
//       </Box>

//       {/* Charts Section */}
//       <Box sx={{ mb: 3 }}>
//         <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
//           {/* Payroll Trend */}
//           <Box sx={{ flex: '1 1 400px', minWidth: 400 }}>
//             <ChartCard title="Payroll Trend (6 Months)" icon={<ShowChart />}>
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={payrollTrendData}>
//                   <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.grey[300], 0.5)} />
//                   <XAxis dataKey="month" stroke={theme.palette.text.secondary} />
//                   <YAxis stroke={theme.palette.text.secondary} />
//                   <Tooltip
//                     formatter={(value: any) => [`${value}K ETB`, 'Total Payroll']}
//                     contentStyle={{
//                       backgroundColor: theme.palette.background.paper,
//                       border: `1px solid ${theme.palette.divider}`,
//                       borderRadius: 8
//                     }}
//                   />
//                   <Line
//                     type="monotone"
//                     dataKey="value"
//                     stroke={theme.palette.primary.main}
//                     strokeWidth={3}
//                     dot={{ fill: theme.palette.primary.main, strokeWidth: 2, r: 5 }}
//                     activeDot={{ r: 8, fill: theme.palette.primary.main }}
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             </ChartCard>
//           </Box>

//           {/* Cost Distribution */}
//           <Box sx={{ flex: '1 1 400px', minWidth: 400 }}>
//             <ChartCard title="Labor Cost Distribution" icon={<PieChartIcon />}>
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie
//                     data={costDistributionData}
//                     cx="50%"
//                     cy="50%"
//                     innerRadius={60}
//                     outerRadius={100}
//                     paddingAngle={5}
//                     dataKey="value"
//                   >
//                     {costDistributionData.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={entry.color} />
//                     ))}
//                   </Pie>
//                   <Tooltip
//                     contentStyle={{
//                       backgroundColor: theme.palette.background.paper,
//                       border: `1px solid ${theme.palette.divider}`,
//                       borderRadius: 8
//                     }}
//                   />
//                   <Legend
//                     layout="vertical"
//                     verticalAlign="middle"
//                     align="right"
//                     wrapperStyle={{ fontSize: '12px' }}
//                   />
//                 </PieChart>
//               </ResponsiveContainer>
//             </ChartCard>
//           </Box>

//           {/* Tax Breakdown */}
//           {/* <Box sx={{ flex: '1 1 400px', minWidth: 400 }}>
//             <ChartCard title="Tax Breakdown" icon={<Receipt />}>
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie
//                     data={taxBreakdownData}
//                     cx="50%"
//                     cy="50%"
//                     outerRadius={100}
//                     paddingAngle={5}
//                     dataKey="value"
//                   >
//                     {taxBreakdownData.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={entry.color} />
//                     ))}
//                   </Pie>
//                   <Tooltip
//                     contentStyle={{
//                       backgroundColor: theme.palette.background.paper,
//                       border: `1px solid ${theme.palette.divider}`,
//                       borderRadius: 8
//                     }}
//                   />
//                   <Legend
//                     layout="vertical"
//                     verticalAlign="middle"
//                     align="right"
//                     wrapperStyle={{ fontSize: '12px' }}
//                   />
//                 </PieChart>
//               </ResponsiveContainer>
//             </ChartCard>
//           </Box> */}

//           {/* Overtime Costs */}
//           <Box sx={{ flex: '1 1 400px', minWidth: 400 }}>
//             <ChartCard title="Overtime by Department" icon={<BarChart />}>
//               <ResponsiveContainer width="100%" height="100%">
//                 <RechartsBarChart data={overtimeData}>
//                   <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.grey[300], 0.5)} />
//                   <XAxis dataKey="department" stroke={theme.palette.text.secondary} />
//                   <YAxis stroke={theme.palette.text.secondary} />
//                   <Tooltip
//                     formatter={(value: any) => [`${value} ETB`, 'Overtime Cost']}
//                     contentStyle={{
//                       backgroundColor: theme.palette.background.paper,
//                       border: `1px solid ${theme.palette.divider}`,
//                       borderRadius: 8
//                     }}
//                   />
//                   <Bar
//                     dataKey="cost"
//                     fill={theme.palette.primary.main}
//                     radius={[4, 4, 0, 0]}
//                   />
//                 </RechartsBarChart>
//               </ResponsiveContainer>
//             </ChartCard>
//           </Box>
//         </Box>
//       </Box>

//       {/* Filters and Actions */}
//       <Card sx={{ mb: 3 }}>
//         <CardContent sx={{ p: 3 }}>
//           <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
//             <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
//               <FormControl sx={{ minWidth: 200 }}>
//                 <InputLabel>Period</InputLabel>
//                 <Select
//                   value={period}
//                   label="Period"
//                   onChange={(e) => setPeriod(e.target.value)}
//                   size="small"
//                 >
//                   <MenuItem value="current">Current Pay Period</MenuItem>
//                   <MenuItem value="last">Last Pay Period</MenuItem>
//                   <MenuItem value="month">This Month</MenuItem>
//                   <MenuItem value="lastMonth">Last Month</MenuItem>
//                 </Select>
//               </FormControl>

//               <FormControl sx={{ minWidth: 200 }}>
//                 <InputLabel>Department</InputLabel>
//                 <Select
//                   value={department}
//                   label="Department"
//                   onChange={(e) => setDepartment(e.target.value)}
//                   size="small"
//                 >
//                   <MenuItem value="all">All Departments</MenuItem>
//                   <MenuItem value="engineering">Engineering</MenuItem>
//                   <MenuItem value="marketing">Marketing</MenuItem>
//                   <MenuItem value="sales">Sales</MenuItem>
//                   <MenuItem value="operations">Operations</MenuItem>
//                 </Select>
//               </FormControl>
//             </Box>

//             <Stack direction="row" spacing={1}>
//               <Button
//                 variant="outlined"
//                 startIcon={<FileDownload />}
//                 size="small"
//               >
//                 Export
//               </Button>
//               <Button
//                 variant="outlined"
//                 startIcon={<Print />}
//                 size="small"
//               >
//                 Print
//               </Button>
//               <Button
//                 variant="contained"
//                 startIcon={<Refresh />}
//                 size="small"
//               >
//                 Refresh
//               </Button>
//             </Stack>
//           </Box>
//         </CardContent>
//       </Card>

//       {/* Payroll Table */}
//       <Card>
//         <CardContent sx={{ p: 0 }}>
//           <Box sx={{ p: 3, pb: 2 }}>
//             <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
//               <Typography variant="h6" sx={{ fontWeight: 600 }}>
//                 Payroll Register
//               </Typography>
//               <Stack direction="row" spacing={1}>
//                 <IconButton size="small">
//                   <Visibility />
//                 </IconButton>
//                 <IconButton size="small">
//                   <FileDownload />
//                 </IconButton>
//                 <IconButton size="small">
//                   <Settings />
//                 </IconButton>
//               </Stack>
//             </Box>
//           </Box>

//           <Divider />

//           <TableContainer>
//             <Table>
//               <TableHead>
//                 <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.1) }}>
//                   <TableCell sx={{ fontWeight: 600 }}>Employee</TableCell>
//                   <TableCell sx={{ fontWeight: 600 }}>Department</TableCell>
//                   <TableCell sx={{ fontWeight: 600 }}>Gross Pay</TableCell>
//                   <TableCell sx={{ fontWeight: 600 }}>Taxes</TableCell>
//                   <TableCell sx={{ fontWeight: 600 }}>Deductions</TableCell>
//                   <TableCell sx={{ fontWeight: 600 }}>Net Pay</TableCell>
//                   <TableCell sx={{ fontWeight: 600 }}>Payment Method</TableCell>
//                   <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {tableData.map((row, index) => (
//                   <TableRow key={index} sx={{ '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.02) } }}>
//                     <TableCell sx={{ fontWeight: 600 }}>{row.employee}</TableCell>
//                     <TableCell>{row.department}</TableCell>
//                     <TableCell sx={{ fontWeight: 600 }}>{row.grossPay}</TableCell>
//                     <TableCell>{row.taxes}</TableCell>
//                     <TableCell>{row.deductions}</TableCell>
//                     <TableCell sx={{ fontWeight: 600, color: theme.palette.primary.main }}>{row.netPay}</TableCell>
//                     <TableCell>{row.paymentMethod}</TableCell>
//                     <TableCell>
//                       <Chip
//                         label={row.status}
//                         size="small"
//                         color={row.status === 'Completed' ? 'success' : 'warning'}
//                         sx={{ fontWeight: 600 }}
//                       />
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </CardContent>
//       </Card>

//       {/* Summary Footer */}
//       <Card sx={{ mt: 3 }}>
//         <CardContent sx={{ p: 2 }}>
//           <Typography variant="body2" sx={{ textAlign: 'center', color: theme.palette.text.secondary }}>
//             Showing payroll data for June 1-15, 2023 • Last updated: Today at 10:45 AM
//           </Typography>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// }

export default () => {
  return null;
};
