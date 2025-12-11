'use client';

import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    alpha
} from '@mui/material';
import {
    TrendingUp,
    TrendingDown
} from '@mui/icons-material';

interface SummaryCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
    subtitle?: string;
    trend?: number;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
    title,
    value,
    icon: Icon,
    color,
    subtitle,
    trend
}) => (
    <Card sx={{
        background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(color, 0.05)} 100%)`,
        border: `1px solid ${alpha(color, 0.2)}`,
        borderRadius: 1.5,
        height: '100%',
        // maxwidth: 300,
        transition: 'all 0.2s ease',
        '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: `0 4px 12px ${alpha(color, 0.15)}`,
        }
    }}>
        <CardContent sx={{ p: 1.5 }}>
            <Box sx={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: 1
            }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="caption" sx={{
                        color: alpha('#000', 0.6),
                        fontWeight: 500,
                        fontSize: '0.7rem',
                        lineHeight: 1.2,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        mb: 0.25
                    }}>
                        {title}
                    </Typography>
                    <Typography variant="h6" sx={{
                        color: color,
                        fontWeight: 700,
                        fontSize: '1.125rem',
                        lineHeight: 1.2
                    }}>
                        {value}
                    </Typography>
                    {subtitle && (
                        <Typography variant="caption" sx={{
                            color: alpha('#000', 0.5),
                            fontSize: '0.7rem',
                            display: 'block',
                            mt: 0.25
                        }}>
                            {subtitle}
                        </Typography>
                    )}
                </Box>
                <Box sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: alpha(color, 0.1),
                    flexShrink: 0
                }}>
                    <Icon sx={{ color, fontSize: 16 }} />
                </Box>
            </Box>

            {trend !== undefined && (
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    mt: 1,
                    pt: 0.75,
                    borderTop: `1px solid ${alpha('#000', 0.1)}`
                }}>
                    {trend >= 0 ? (
                        <TrendingUp sx={{ fontSize: 12, color: '#10B981' }} />
                    ) : (
                        <TrendingDown sx={{ fontSize: 12, color: '#EF4444' }} />
                    )}
                    <Typography variant="caption" sx={{
                        color: trend >= 0 ? '#10B981' : '#EF4444',
                        fontWeight: 600,
                        fontSize: '0.7rem'
                    }}>
                        {trend >= 0 ? '+' : ''}{trend}%
                    </Typography>
                </Box>
            )}
        </CardContent>
    </Card>
);

export default SummaryCard;