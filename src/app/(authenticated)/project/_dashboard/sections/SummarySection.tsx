'use client';

import React from 'react';
import {
    Box,
    Typography,
    Collapse,
    Chip,
    alpha
} from '@mui/material';
import SummaryCard from '../_components/SummaryCard';
import { colors, formatCurrency } from '../../_utils/consts';
import { Folder, Money, Timeline, BarChart } from '@mui/icons-material';

interface SummarySectionProps {
    dashboardData: any;
    expanded: boolean;
    budget?: number;
}

const SummarySection: React.FC<SummarySectionProps> = ({
    dashboardData,
    expanded,
    budget
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
                    color: colors.primary,
                    fontSize: '1.125rem'
                }}>
                    Summary Overview
                </Typography>
            </Box>
            <Collapse in={expanded}>
                <Box sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 2
                }}>
                    <Box sx={{ flex: '1 1 240px', minWidth: 0 }}>
                        <SummaryCard
                            title="Total Projects"
                            value={dashboardData.summary.totalProjects}
                            icon={Folder}
                            color={colors.primary}
                            subtitle={`${dashboardData.summary.activeProjects} active, ${dashboardData.summary.closedProjects} closed`}
                        />
                    </Box>
                    <Box sx={{ flex: '1 1 240px', minWidth: 0 }}>
                        <SummaryCard
                            title="Planned Budget"
                            value={formatCurrency(dashboardData.summary.totalPlannedBudget)}
                            icon={Money}
                            color={colors.success}
                            subtitle={`Actual: ${formatCurrency(dashboardData.summary.totalActualCost)}`}
                        />
                    </Box>
                    <Box sx={{ flex: '1 1 240px', minWidth: 0 }}>
                        <SummaryCard
                            title="Average Progress"
                            value={
                                dashboardData?.summary?.averageProgressPercent != null
                                    ? `${dashboardData.summary.averageProgressPercent}%`
                                    : "No Data"
                            }
                            icon={Timeline}
                            color={colors.warning}
                            subtitle="Across all projects"
                        />
                    </Box>
                    <Box sx={{ flex: '1 1 240px', minWidth: 0 }}>
                        <SummaryCard
                            title="Budget Utilization"
                            value={
                                typeof budget === "number" && !isNaN(budget)
                                    ? `${Math.min(budget, 100)}%`
                                    : "No Data"
                            }
                            icon={BarChart}
                            color={
                                typeof budget === "number" && budget > 100
                                    ? colors.error
                                    : colors.success
                            }
                            subtitle="Actual vs Planned"
                        />
                    </Box>
                </Box>

                {/* Approval Status Breakdown */}
                <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" sx={{
                        fontWeight: 600,
                        mb: 1.5,
                        color: colors.gray,
                        fontSize: '0.875rem'
                    }}>
                        Approval Status
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {Object.entries(dashboardData.summary.byApprovalStatus).map(([status, count], index) => (
                            <Chip
                                key={status}
                                label={`${status}: ${count}`}
                                size="small"
                                sx={{
                                    bgcolor: alpha(colors.purple, 0.08),
                                    color: colors.purple,
                                    fontWeight: 500,
                                    height: 24,
                                    fontSize: '0.75rem'
                                }}
                            />
                        ))}
                    </Box>
                </Box>
            </Collapse>
        </Box>
    );
};

export default SummarySection;