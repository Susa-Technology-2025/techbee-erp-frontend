'use client';

import React from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Avatar,
    Chip
} from '@mui/material';
import { TeamMember } from '../../../_utils/types';

interface TeamMemberCardProps {
    member: TeamMember;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member }) => {
    return (
        <Card sx={{ flex: '1 1 250px', minWidth: 250 }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar sx={{ bgcolor: '#4361ee', width: 56, height: 56 }}>
                        {member.name?.[0]?.toUpperCase() || 'U'}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" fontWeight={600}>
                            {member.name || 'Unnamed User'}
                        </Typography>
                        <Typography variant="body2" color="#64748b" noWrap>
                            {member.email}
                        </Typography>
                        {member.department && (
                            <Typography variant="caption" color="#64748b" display="block">
                                {member.department}
                            </Typography>
                        )}
                        {member.role && (
                            <Typography variant="caption" color="#64748b">
                                {member.role}
                            </Typography>
                        )}
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box>
                        <Typography variant="h4" fontWeight={700} color="#4361ee">
                            {member.tasksCompleted}
                        </Typography>
                        <Typography variant="caption" color="#64748b">
                            Tasks Completed
                        </Typography>
                    </Box>
                    <Chip
                        label={member.availability}
                        size="small"
                        color={member.availability === 'available' ? 'success' : 'warning'}
                    />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="body2" color="#64748b">
                            Active Tasks: {member.tasksActive}
                        </Typography>
                    </Box>
                    {member.performance !== null && (
                        <Typography variant="body2" color="#4361ee" fontWeight={600}>
                            {member.performance}% Performance
                        </Typography>
                    )}
                </Box>
                {member.assignments.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                        <Typography variant="caption" color="#64748b" display="block">
                            Assigned to {member.assignments.length} project(s)
                        </Typography>
                        {member.assignments.slice(0, 2).map((assignment, idx) => (
                            <Typography key={idx} variant="caption" color="#64748b" display="block">
                                • {assignment.projectCode} ({assignment.allocationPercent || 0}%)
                            </Typography>
                        ))}
                        {member.assignments.length > 2 && (
                            <Typography variant="caption" color="#64748b">
                                +{member.assignments.length - 2} more
                            </Typography>
                        )}
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default TeamMemberCard;