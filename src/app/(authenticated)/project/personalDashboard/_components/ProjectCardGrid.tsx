// import React, { useState } from 'react';
// import {
//     Box,
//     Typography,
//     Card,
//     CardContent,
//     CardActions,
//     Button,
//     IconButton,
//     Chip,
//     Avatar,
//     LinearProgress,
//     CardHeader,
//     Tooltip,
// } from '@mui/material';
// import FolderIcon from '@mui/icons-material/Folder';
// import ShareIcon from '@mui/icons-material/Share';
// import EditIcon from '@mui/icons-material/Edit';
// import GroupIcon from '@mui/icons-material/Group';
// import { Project } from './types'



// const ProjectCardGrid = ({ project }: { project: Project }) => (
//     <Card sx={{ height: '100%', position: 'relative', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
//         <CardHeader
//             avatar={
//                 <Avatar sx={{ bgcolor: '#e0e7ff' }}>
//                     <FolderIcon sx={{ color: '#4361ee' }} />
//                 </Avatar>
//             }
//             // action={
//             //     <IconButton onClick={() => toggleFavorite(project.id, 'project')}>
//             //         {project.favorite ? <StarIcon color="warning" /> : <StarBorderIcon />}
//             //     </IconButton>
//             // }
//             title={
//                 <Typography variant="h6" fontWeight={600}>
//                     {project.name}
//                 </Typography>
//             }
//             subheader={
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
//                     <Chip label={project.category} size="small" />
//                     <Chip
//                         label={project.status}
//                         size="small"
//                         color={project.status === 'active' ? 'success' : project.status === 'pending' ? 'warning' : 'info'}
//                     />
//                 </Box>
//             }
//         />
//         <CardContent>
//             <Typography variant="body2" color="text.secondary" paragraph>
//                 {project.description}
//             </Typography>
//             <Box sx={{ mb: 2 }}>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
//                     <Typography variant="caption">Progress</Typography>
//                     <Typography variant="caption" fontWeight={600}>{project.progress}%</Typography>
//                 </Box>
//                 <LinearProgress variant="determinate" value={project.progress} sx={{ height: 8, borderRadius: 4 }} />
//             </Box>
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//                     <GroupIcon fontSize="small" />
//                     <Typography variant="caption">{project.contributors} contributors</Typography>
//                 </Box>
//                 <Typography variant="caption">
//                     Due: {new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
//                 </Typography>
//             </Box>
//         </CardContent>
//         <CardActions sx={{ justifyContent: 'space-between', p: 2, pt: 0 }}>
//             <Button size="small" onClick={() => handleProjectClic(project)}>View Details</Button>
//             <Box sx={{ display: 'flex', gap: 1 }}>
//                 <Tooltip title="Edit">
//                     <IconButton size="small">
//                         <EditIcon fontSize="small" />
//                     </IconButton>
//                 </Tooltip>
//                 <Tooltip title="Share">
//                     <IconButton size="small">
//                         <ShareIcon fontSize="small" />
//                     </IconButton>
//                 </Tooltip>
//             </Box>
//         </CardActions>
//     </Card>
// );