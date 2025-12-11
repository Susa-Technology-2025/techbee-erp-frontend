'use client';

import React from 'react';
import {
    Box,
    Typography,
    Collapse
} from '@mui/material';
import DataCard from '../_components/DataCard';
import NoDataMessage from '../_components/NoDataMessage';
import { colors } from '../../_utils/consts';
import { TrendingFlat } from '@mui/icons-material';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip as RechartsTooltip,
    Legend
} from 'recharts';
import { format, parseISO } from 'date-fns';

interface AnalyticsTrendsSectionProps {
    dashboardData: any;
    expanded: boolean;
}

const AnalyticsTrendsSection: React.FC<AnalyticsTrendsSectionProps> = ({
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
                    color: colors.primary,
                    fontSize: '1.125rem'
                }}>
                    Analytics & Trends
                </Typography>
            </Box>
            <Collapse in={expanded}>
                <DataCard title="Monthly Trends" icon={TrendingFlat} color={colors.primary} defaultExpanded={true}>
                    {dashboardData.monthlyTrends.length > 0 ? (
                        <Box sx={{ height: 250 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={dashboardData.monthlyTrends}>
                                    <CartesianGrid strokeDasharray="2 2" stroke="rgba(0, 0, 0, 0.08)" />
                                    <XAxis
                                        dataKey="month"
                                        tickFormatter={(value) => format(parseISO(value + '-01'), 'MMM yy')}
                                        fontSize={11}
                                    />
                                    <YAxis fontSize={11} />
                                    <RechartsTooltip
                                        formatter={(value: any) => [value, '']}
                                        labelFormatter={(label) => format(parseISO(label + '-01'), 'MMM yyyy')}
                                    />
                                    <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
                                    <Area
                                        type="monotone"
                                        dataKey="newProjectsCount"
                                        name="New Projects"
                                        stroke={colors.primary}
                                        fill={`rgba(${parseInt(colors.primary.slice(1, 3), 16)}, ${parseInt(colors.primary.slice(3, 5), 16)}, ${parseInt(colors.primary.slice(5, 7), 16)}, 0.25)`}
                                        strokeWidth={1.5}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="totalBudget"
                                        name="Total Budget"
                                        stroke={colors.success}
                                        fill={`rgba(${parseInt(colors.success.slice(1, 3), 16)}, ${parseInt(colors.success.slice(3, 5), 16)}, ${parseInt(colors.success.slice(5, 7), 16)}, 0.25)`}
                                        strokeWidth={1.5}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </Box>
                    ) : (
                        <NoDataMessage message="No monthly trends data available" />
                    )}
                </DataCard>
            </Collapse>
        </Box>
    );
};

export default AnalyticsTrendsSection;