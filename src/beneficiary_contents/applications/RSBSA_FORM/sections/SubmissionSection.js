import React from 'react';
import {
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Divider,
  Button,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress
} from '@mui/material';
import {
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Security as SecurityIcon,
  Schedule as ScheduleIcon,
  ContactSupport as ContactSupportIcon
} from '@mui/icons-material';

const SubmissionSection = ({ formData, isSubmitting, onSubmit, canSubmit }) => {
  const submissionSteps = [
    {
      icon: <SecurityIcon color="primary" />,
      title: 'Data Validation',
      description: 'Your information will be validated for completeness and accuracy'
    },
    {
      icon: <SendIcon color="primary" />,
      title: 'Form Submission',
      description: 'Your RSBSA application will be submitted to the system'
    },
    {
      icon: <ScheduleIcon color="primary" />,
      title: 'Processing',
      description: 'Your application will be queued for review and verification'
    },
    {
      icon: <CheckCircleIcon color="primary" />,
      title: 'Confirmation',
      description: 'You will receive a reference number for tracking'
    }
  ];

  const nextSteps = [
    'Your application will be reviewed by DA personnel',
    'You may be contacted for additional information or documents',
    'Site validation may be conducted for farm parcels',
    'You will be notified of your application status',
    'Upon approval, you will receive your RSBSA number'
  ];

  return (
    <Box>
      {/* Section Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <SendIcon sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
        <Box>
          <Typography variant="h4" component="h2" fontWeight="bold" color="primary">
            Submit Application
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Review the submission process and submit your RSBSA registration
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Submission Process Card */}
        <Grid item xs={12} md={8}>
          <Card variant="outlined" sx={{ borderRadius: 2, height: 'fit-content' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                Submission Process
              </Typography>
              <Divider sx={{ mb: 3 }} />

              {/* Process Steps */}
              <Box sx={{ mb: 4 }}>
                {submissionSteps.map((step, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                    <Box sx={{ mr: 2, mt: 0.5 }}>
                      {step.icon}
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                        {step.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {step.description}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>

              {/* Submission Status */}
              {isSubmitting && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1" gutterBottom>
                    Submitting your application...
                  </Typography>
                  <LinearProgress sx={{ borderRadius: 2 }} />
                </Box>
              )}

              {/* Submit Button */}
              <Box sx={{ textAlign: 'center' }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                  onClick={onSubmit}
                  disabled={!canSubmit || isSubmitting}
                  sx={{ 
                    minWidth: 200,
                    py: 1.5,
                    borderRadius: 2,
                    fontSize: '1.1rem',
                    fontWeight: 'bold'
                  }}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit RSBSA Application'}
                </Button>
              </Box>

              {!canSubmit && !isSubmitting && (
                <Alert severity="warning" sx={{ mt: 2, borderRadius: 2 }}>
                  <Typography variant="body2">
                    Please complete all required fields and fix any validation errors before submitting.
                  </Typography>
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Application Summary Card */}
        <Grid item xs={12} md={4}>
          <Card variant="outlined" sx={{ borderRadius: 2, backgroundColor: 'background.default' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                Application Summary
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Beneficiary:</strong> {formData.beneficiaryProfile.contact_number || 'Not provided'}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Location:</strong> {formData.beneficiaryProfile.barangay}, {formData.beneficiaryProfile.municipality}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Farm Parcels:</strong> {formData.farmParcels.length} parcel(s)
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Total Area:</strong> {formData.farmParcels.reduce((sum, parcel) => sum + (parcel.farm_area || 0), 0).toFixed(2)} hectares
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Livelihood Category:</strong> {formData.farmProfile.livelihood_category_id ? `ID: ${formData.farmProfile.livelihood_category_id}` : 'Not selected'}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Current Status:</strong> {formData.enrollment.status || 'Pending'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* After Submission Information */}
        <Grid item xs={12}>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center' }}>
                <InfoIcon sx={{ mr: 1 }} />
                What Happens After Submission?
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                    Next Steps in the Process:
                  </Typography>
                  <List>
                    {nextSteps.map((step, index) => (
                      <ListItem key={index} sx={{ py: 0.5 }}>
                        <ListItemIcon>
                          <Typography variant="body2" color="primary" fontWeight="bold">
                            {index + 1}.
                          </Typography>
                        </ListItemIcon>
                        <ListItemText 
                          primary={step}
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                    Need Help?
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <ContactSupportIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body2">
                      Contact your local DA office for assistance
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Processing time: 5-10 working days
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Important Notes */}
        <Grid item xs={12}>
          <Alert severity="info" sx={{ borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Important Reminders
            </Typography>
            <Typography variant="body2" paragraph>
              • Keep your reference number safe for tracking your application status
            </Typography>
            <Typography variant="body2" paragraph>
              • Ensure your contact information is correct as you may be contacted for verification
            </Typography>
            <Typography variant="body2" paragraph>
              • Have your supporting documents ready in case they are requested
            </Typography>
            <Typography variant="body2">
              • Your information is protected under the Data Privacy Act of 2012
            </Typography>
          </Alert>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SubmissionSection;