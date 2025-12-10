'use client';

import React from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Chip
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import { TeamMember } from '../../../_utils/types';
import TeamMemberCard from '../cards/TeamMemberCard';

interface TeamTabProps {
    team: {
        members: TeamMember[];
        summary: {
            totalMembers: number;
            activeMembers: number;
            availableMembers: number;
        };
    };
}

const TeamTab: React.FC<TeamTabProps> = ({ team }) => {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    <PeopleIcon sx={{ color: '#4361ee' }} />
                    Team Members ({team.summary.totalMembers})
                </Typography>

                {/* Team Summary Stats */}
                <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                        <Card sx={{ flex: '1 1 150px', minWidth: 150 }}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Typography variant="h4" fontWeight={700} color="#4361ee">
                                    {team.summary.totalMembers}
                                </Typography>
                                <Typography variant="body2" color="#64748b">
                                    Total Members
                                </Typography>
                            </CardContent>
                        </Card>
                        <Card sx={{ flex: '1 1 150px', minWidth: 150 }}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Typography variant="h4" fontWeight={700} color="#10b981">
                                    {team.summary.activeMembers}
                                </Typography>
                                <Typography variant="body2" color="#64748b">
                                    Active Members
                                </Typography>
                            </CardContent>
                        </Card>
                        <Card sx={{ flex: '1 1 150px', minWidth: 150 }}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Typography variant="h4" fontWeight={700} color="#8b5cf6">
                                    {team.summary.availableMembers}
                                </Typography>
                                <Typography variant="body2" color="#64748b">
                                    Available Members
                                </Typography>
                            </CardContent>
                        </Card>
                        <Card sx={{ flex: '1 1 150px', minWidth: 150 }}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Typography variant="h4" fontWeight={700} color="#f59e0b">
                                    {team.members.reduce((sum, member) => sum + member.tasksActive, 0)}
                                </Typography>
                                <Typography variant="body2" color="#64748b">
                                    Active Tasks
                                </Typography>
                            </CardContent>
                        </Card>
                        <Card sx={{ flex: '1 1 150px', minWidth: 150 }}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Typography variant="h4" fontWeight={700} color="#ec4899">
                                    {team.members.reduce((sum, member) => sum + member.tasksCompleted, 0)}
                                </Typography>
                                <Typography variant="body2" color="#64748b">
                                    Completed Tasks
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>
                </Box>

                {team.members.length > 0 ? (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
                        {team.members.map((member) => (
                            <TeamMemberCard key={member.employeeId} member={member} />
                        ))}
                    </Box>
                ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <PeopleIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                        <Typography color="text.secondary">
                            No team members found
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default TeamTab;