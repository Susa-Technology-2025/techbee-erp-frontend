'use client';

import React, { useState } from 'react';
import {
    Card,
    CardContent,
    Box,
    Typography,
    IconButton,
    Collapse,
    alpha
} from '@mui/material';
import {
    ExpandMore,
    ExpandLess
} from '@mui/icons-material';

interface DataCardProps {
    title: string;
    icon: React.ElementType;
    color: string;
    children: React.ReactNode;
    collapsible?: boolean;
    defaultExpanded?: boolean;
}

const DataCard: React.FC<DataCardProps> = ({
    title,
    icon: Icon,
    color,
    children,
    collapsible = false,
    defaultExpanded = true
}) => {
    const [expanded, setExpanded] = useState(defaultExpanded);

    return (
        <Card sx={{
            borderRadius: 2,
            border: `1px solid ${alpha(color, 0.15)}`,
            overflow: 'hidden'
        }}>
            <Box sx={{
                p: 1.5,
                bgcolor: alpha(color, 0.04),
                borderBottom: expanded ? `1px solid ${alpha(color, 0.08)}` : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Icon sx={{ color, fontSize: 18 }} />
                    <Typography variant="subtitle1" sx={{
                        fontWeight: 600,
                        color,
                        fontSize: '0.9375rem'
                    }}>
                        {title}
                    </Typography>
                </Box>
                {collapsible && (
                    <IconButton
                        size="small"
                        onClick={() => setExpanded(!expanded)}
                        sx={{ color, p: 0.25 }}
                    >
                        {expanded ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                )}
            </Box>
            <Collapse in={expanded}>
                <CardContent sx={{ p: 2 }}>
                    {children}
                </CardContent>
            </Collapse>
        </Card>
    );
};

export default DataCard;