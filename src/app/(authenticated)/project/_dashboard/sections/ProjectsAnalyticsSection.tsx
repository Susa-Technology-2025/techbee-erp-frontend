'use client';

import React from 'react';
import {
    Box,
    Typography,
    Collapse,
    Chip,
    Paper,
    Stack,
    alpha
} from '@mui/material';
import DataCard from '../_components/DataCard';
import NoDataMessage from '../_components/NoDataMessage';
import ProgressBarWithLabel from '../_components/ProgressBarWithLabel';
import { colors, formatCurrency } from '../../_utils/consts';
import {
    Category,
    Assignment,
    Receipt,
    Group,
    Business
} from '@mui/icons-material';
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip as RechartsTooltip
} from 'recharts';

interface ProjectsAnalyticsSectionProps {
    dashboardData: any;
    expanded: boolean;
}

const ProjectsAnalyticsSection: React.FC<ProjectsAnalyticsSectionProps> = ({
    dashboardData,
    expanded
}) => {
    return (
        <Box sx={{ mb: 3 }}>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 1.5,
            }}>
                <Typography variant="h6" sx={{
                    fontWeight: 700,
                    color: colors.indigo,
                    fontSize: '1.125rem'
                }}>
                    Projects Analytics
                </Typography>
            </Box>
            <Collapse in={expanded}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2.5 }}>
                    {/* Projects by Stage */}
                    <Box sx={{ flex: '1 1 320px', minWidth: 0 }}>
                        <DataCard title="Projects by Stage" icon={Category} color={colors.indigo}>
                            {dashboardData.pipelineByStage.length > 0 ? (
                                <>
                                    <Box sx={{ height: 200, mb: 1.5 }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={dashboardData.pipelineByStage}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={({ stageName, count }) =>
                                                        `${stageName || 'Unassigned'}: ${count}`
                                                    }
                                                    outerRadius={60}
                                                    fill="#8884d8"
                                                    dataKey="count"
                                                >
                                                    {dashboardData.pipelineByStage.map((entry: any, index: number) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={[
                                                                colors.indigo,
                                                                colors.primary,
                                                                colors.success,
                                                                colors.warning,
                                                                colors.error,
                                                                colors.purple
                                                            ][index % 6]}
                                                        />
                                                    ))}
                                                </Pie>
                                                <RechartsTooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </Box>
                                    <Stack spacing={0.75}>
                                        {dashboardData.pipelineByStage.map((stage: any, index: number) => (
                                            <Box key={index} sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                p: 1,
                                                borderRadius: 1,
                                                bgcolor: alpha(colors.indigo, 0.04)
                                            }}>
                                                <Typography variant="body2" sx={{ fontSize: '0.8125rem' }}>
                                                    {stage.stageName || 'Unassigned'}
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Chip
                                                        label={`${stage.count} projects`}
                                                        size="small"
                                                        variant="outlined"
                                                        sx={{ fontSize: '0.7rem', height: 20 }}
                                                    />
                                                    <Typography variant="body2" sx={{
                                                        color: colors.gray,
                                                        fontSize: '0.8125rem'
                                                    }}>
                                                        {formatCurrency(stage.totalBudget)}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        ))}
                                    </Stack>
                                </>
                            ) : (
                                <NoDataMessage />
                            )}
                        </DataCard>
                    </Box>

                    {/* Projects by Type */}
                    <Box sx={{ flex: '1 1 320px', minWidth: 0 }}>
                        <DataCard title="Projects by Type" icon={Assignment} color={colors.purple}>
                            {dashboardData.projectsByType.length > 0 ? (
                                <Stack spacing={1.5}>
                                    {dashboardData.projectsByType.map((type: any, index: number) => (
                                        <Paper key={type.projectTypeId} sx={{
                                            p: 1.5,
                                            borderRadius: 1.5,
                                            border: `1px solid ${alpha(colors.purple, 0.1)}`
                                        }}>
                                            <Box sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                mb: 0.75
                                            }}>
                                                <Typography variant="subtitle2" sx={{
                                                    fontWeight: 600,
                                                    fontSize: '0.8125rem'
                                                }}>
                                                    {type.projectTypeName}
                                                </Typography>
                                                <Chip
                                                    label={`${type.count} projects`}
                                                    size="small"
                                                    color="primary"
                                                    sx={{ fontSize: '0.7rem', height: 22 }}
                                                />
                                            </Box>
                                            <Typography variant="caption" sx={{
                                                color: colors.gray,
                                                display: 'block',
                                                mb: 0.75,
                                                fontSize: '0.75rem'
                                            }}>
                                                {type.projectTypeCode}
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontSize: '0.8125rem' }}>
                                                Total Budget: {formatCurrency(type.totalBudget)}
                                            </Typography>
                                        </Paper>
                                    ))}
                                </Stack>
                            ) : (
                                <NoDataMessage />
                            )}
                        </DataCard>
                    </Box>
                </Box>

                {/* Billing Methods and Manager Workload */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2.5, mt: 2.5 }}>
                    <Box sx={{ flex: '1 1 250px', minWidth: 0 }}>
                        <DataCard title="Billing Methods" icon={Receipt} color={colors.teal}>
                            {dashboardData.projectsByBillingMethod.length > 0 ? (
                                <Stack spacing={0.75}>
                                    {dashboardData.projectsByBillingMethod.map((method: any, index: number) => (
                                        <Box key={index} sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            p: 1,
                                            borderRadius: 1.5,
                                            border: `1px solid ${alpha(colors.teal, 0.15)}`,
                                            bgcolor: alpha(colors.teal, 0.04)
                                        }}>
                                            <Typography variant="body2" sx={{ fontSize: '0.8125rem' }}>
                                                {method.billingMethodName || 'Not Specified'}
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                                <Chip
                                                    label={`${method.projectCount} projects`}
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{ fontSize: '0.7rem', height: 20 }}
                                                />
                                                <Typography variant="body2" sx={{
                                                    fontWeight: 600,
                                                    color: colors.teal,
                                                    fontSize: '0.8125rem'
                                                }}>
                                                    {formatCurrency(method.totalBudget)}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    ))}
                                </Stack>
                            ) : (
                                <NoDataMessage />
                            )}
                        </DataCard>
                    </Box>

                    <Box sx={{ flex: '1 1 250px', minWidth: 0 }}>
                        <DataCard title="Manager Workload" icon={Group} color={colors.orange}>
                            {dashboardData.managerWorkload.length > 0 ? (
                                <Stack spacing={1.5}>
                                    {dashboardData.managerWorkload.map((manager: any, index: number) => (
                                        <Box key={manager.projectManagerEmployeeId} sx={{ p: 1.5, borderRadius: 1.5 }}>
                                            <Typography variant="subtitle2" sx={{
                                                fontWeight: 600,
                                                mb: 0.75,
                                                fontSize: '0.8125rem'
                                            }}>
                                                Manager {manager.projectManagerEmployeeId.slice(0, 8)}...
                                            </Typography>
                                            <Box sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                mb: 0.75
                                            }}>
                                                <Typography variant="body2" sx={{ fontSize: '0.8125rem' }}>
                                                    Projects: {manager.projectCount}
                                                </Typography>
                                                <Typography variant="body2" sx={{
                                                    fontWeight: 600,
                                                    color: colors.orange,
                                                    fontSize: '0.8125rem'
                                                }}>
                                                    {formatCurrency(manager.totalBudget)}
                                                </Typography>
                                            </Box>
                                            <ProgressBarWithLabel
                                                value={manager.averageProgressPercent}
                                                color={colors.orange}
                                            />
                                        </Box>
                                    ))}
                                </Stack>
                            ) : (
                                <NoDataMessage />
                            )}
                        </DataCard>
                    </Box>

                    <Box sx={{ flex: '1 1 250px', minWidth: 0 }}>
                        <DataCard title="Projects by Customer" icon={Business} color={colors.pink}>
                            {dashboardData.projectsByCustomer.length > 0 ? (
                                <Stack spacing={0.75}>
                                    {dashboardData.projectsByCustomer.map((customer: any, index: number) => (
                                        <Paper key={index} sx={{
                                            p: 1.25,
                                            borderRadius: 1.5,
                                            border: `1px solid ${alpha(colors.pink, 0.1)}`
                                        }}>
                                            <Typography variant="subtitle2" sx={{
                                                fontWeight: 600,
                                                mb: 0.5,
                                                fontSize: '0.8125rem'
                                            }}>
                                                {customer.customerName}
                                            </Typography>
                                            <Box sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}>
                                                <Chip
                                                    label={`${customer.projectCount} projects`}
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{ fontSize: '0.7rem', height: 20 }}
                                                />
                                                <Typography variant="body2" sx={{
                                                    fontWeight: 600,
                                                    color: colors.pink,
                                                    fontSize: '0.8125rem'
                                                }}>
                                                    {formatCurrency(customer.totalBudget)}
                                                </Typography>
                                            </Box>
                                        </Paper>
                                    ))}
                                </Stack>
                            ) : (
                                <NoDataMessage />
                            )}
                        </DataCard>
                    </Box>
                </Box>
            </Collapse>
        </Box>
    );
};

export default ProjectsAnalyticsSection;