// components/compliance-detail-modal.tsx
"use client";

import {
  Modal,
  Box,
  Typography,
  Chip,
  Divider,
  Paper,
  IconButton,
  Stack,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  Assignment as AssignmentIcon,
  BusinessCenter as BusinessIcon,
  Description as DescriptionIcon,
  VerifiedUser as VerifiedUserIcon,
  Assessment as AssessmentIcon,
  CalendarToday as CalendarIcon,
  Code as CodeIcon,
  Category as CategoryIcon,
} from "@mui/icons-material";

interface ComplianceDetailModalProps {
  open: boolean;
  handleClose: () => void;
  row: any;
}

export const ComplianceDetailModal = ({
  open,
  handleClose,
  row,
}: ComplianceDetailModalProps) => {
  if (!row) return null;

//   console.log("************** Compliance Detail Modal:", open, row);

  const compliance = row;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Legal":
        return "primary";
      case "Safety":
        return "error";
      case "Policy":
        return "info";
      case "Certification":
        return "success";
      case "Training":
        return "warning";
      case "Other":
        return "default";
      default:
        return "default";
    }
  };

  const getAuditResultColor = (result: string) => {
    switch (result) {
      case "Passed":
        return "success";
      case "Failed":
        return "error";
      case "Warning":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="compliance-detail-modal-title"
      aria-describedby="compliance-detail-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "95%", md: "80%", lg: "70%" },
          maxHeight: "90vh",
          overflowY: "auto",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          sx={{ mb: 2 }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <VerifiedUserIcon color="primary" sx={{ fontSize: 32 }} />
            <Box>
              <Typography
                id="compliance-detail-modal-title"
                variant="h5"
                component="h2"
                fontWeight="bold"
              >
                {compliance.name}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 1 }}>
                <Chip
                  label={compliance.type}
                  color={getTypeColor(compliance.type)}
                  variant="outlined"
                  size="small"
                />
                <Typography variant="body2" color="text.secondary">
                  Code: {compliance.code}
                </Typography>
              </Stack>
            </Box>
          </Stack>
          <IconButton onClick={handleClose} size="large">
            <CloseIcon />
          </IconButton>
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
          <Stack spacing={3}>
            {/* Basic Information */}
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                <BusinessIcon color="primary" />
                <Typography variant="h6" color="primary" fontWeight="bold">
                  Compliance Information
                </Typography>
              </Stack>
              
              <Stack spacing={2.5}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
                  <Box sx={{ flex: 1 }}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                      <CodeIcon color="action" fontSize="small" />
                      <Typography variant="subtitle2" color="text.secondary">
                        Compliance Code
                      </Typography>
                    </Stack>
                    <Typography variant="body1" fontWeight="medium">
                      {compliance.code}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                      <CategoryIcon color="action" fontSize="small" />
                      <Typography variant="subtitle2" color="text.secondary">
                        Type
                      </Typography>
                    </Stack>
                    <Chip
                      label={compliance.type}
                      color={getTypeColor(compliance.type)}
                      size="small"
                    />
                  </Box>
                </Box>
                
                <Box>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <DescriptionIcon color="action" fontSize="small" />
                    <Typography variant="subtitle2" color="text.secondary">
                      Description
                    </Typography>
                  </Stack>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      lineHeight: 1.6,
                      backgroundColor: 'grey.50',
                      p: 2,
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: 'grey.200'
                    }}
                  >
                    {compliance.description}
                  </Typography>
                </Box>
              </Stack>
            </Paper>

            {/* Requirements Section */}
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                <AssignmentIcon color="primary" />
                <Typography variant="h6" color="primary" fontWeight="bold">
                  Compliance Requirements
                </Typography>
                <Chip 
                  label={`${compliance.requirements?.length || 0} requirements`} 
                  size="small" 
                  variant="outlined"
                />
              </Stack>

              {compliance.requirements && compliance.requirements.length > 0 ? (
                <List sx={{ width: '100%' }}>
                  {compliance.requirements.map((requirement: any, index: number) => (
                    <Box key={requirement.id}>
                      <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                          <Chip 
                            label={index + 1} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
                              <Typography variant="subtitle1" fontWeight="bold">
                                {requirement.name}
                              </Typography>
                              <Chip 
                                label={requirement.entityType} 
                                size="small" 
                                variant="filled"
                                color="secondary"
                              />
                            </Stack>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                Code: {requirement.code}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                ID: {requirement.id}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < compliance.requirements.length - 1 && (
                        <Divider variant="inset" component="li" />
                      )}
                    </Box>
                  ))}
                </List>
              ) : (
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  fontStyle="italic"
                  sx={{ textAlign: 'center', py: 3 }}
                >
                  No requirements defined for this compliance record.
                </Typography>
              )}
            </Paper>

            {/* Audit History */}
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                <AssessmentIcon color="primary" />
                <Typography variant="h6" color="primary" fontWeight="bold">
                  Audit History
                </Typography>
                <Chip 
                  label={`${compliance.audits?.length || 0} audits`} 
                  size="small" 
                  variant="outlined"
                />
              </Stack>

              {compliance.audits && compliance.audits.length > 0 ? (
                <Stack spacing={2}>
                  {compliance.audits.map((audit: any, index: number) => (
                    <Paper 
                      key={audit.id} 
                      variant="outlined" 
                      sx={{ 
                        p: 2, 
                        backgroundColor: 'grey.50',
                        borderLeft: 4,
                        borderLeftColor: getAuditResultColor(audit.result) === 'success' ? 'success.main' : 
                                       getAuditResultColor(audit.result) === 'error' ? 'error.main' : 
                                       'warning.main'
                      }}
                    >
                      <Stack spacing={1.5}>
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' } }}>
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Chip
                              label={audit.result}
                              color={getAuditResultColor(audit.result)}
                              size="small"
                            />
                            <Typography variant="subtitle1" fontWeight="medium">
                              {audit.performedBy}
                            </Typography>
                          </Stack>
                          <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: { xs: 1, sm: 0 } }}>
                            <CalendarIcon color="action" fontSize="small" />
                            <Typography variant="body2" color="text.secondary">
                              {formatDate(audit.performedAt)}
                            </Typography>
                          </Stack>
                        </Box>
                        
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Compliance Rate
                            </Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {audit.complianceRate}%
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Audit ID
                            </Typography>
                            <Typography variant="body2" fontFamily="monospace">
                              {audit.id}
                            </Typography>
                          </Box>
                        </Box>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              ) : (
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  fontStyle="italic"
                  sx={{ textAlign: 'center', py: 3 }}
                >
                  No audit history available for this compliance record.
                </Typography>
              )}
            </Paper>

            {/* System Metadata */}
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                System Information
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Created
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
                    <CalendarIcon color="action" fontSize="small" />
                    <Typography variant="body2">
                      {formatDate(compliance.createdAt)}
                    </Typography>
                  </Stack>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Last Updated
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
                    <CalendarIcon color="action" fontSize="small" />
                    <Typography variant="body2">
                      {formatDate(compliance.updatedAt)}
                    </Typography>
                  </Stack>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Record ID
                  </Typography>
                  <Typography variant="body2" fontFamily="monospace" sx={{ mt: 0.5 }}>
                    {compliance.id}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Stack>
        </Box>

        {/* Footer Actions */}
        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button onClick={handleClose} variant="outlined">
            Close
          </Button>
          {/* <Button variant="contained" color="primary">
            Edit Compliance
          </Button> */}
        </Box>
      </Box>
    </Modal>
  );
};