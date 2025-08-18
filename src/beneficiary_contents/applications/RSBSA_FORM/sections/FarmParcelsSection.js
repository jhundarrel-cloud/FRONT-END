import React from 'react';
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Card,
  CardContent,
  Divider,
  FormHelperText,
  Chip,
  Button,
  IconButton,
  FormControlLabel,
  Switch,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Landscape as LandscapeIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';

const FarmParcelsSection = ({ farmParcels, errors, addFarmParcel, updateFarmParcel, removeFarmParcel }) => {
  // Options based on database enum values
  const tenureTypeOptions = [
    { value: 'registered_owner', label: 'Registered Owner' },
    { value: 'tenant', label: 'Tenant' },
    { value: 'lessee', label: 'Lessee' }
  ];

  const farmTypeOptions = [
    { value: 'irrigated', label: 'Irrigated' },
    { value: 'rainfed_upland', label: 'Rainfed Upland' },
    { value: 'rainfed_lowland', label: 'Rainfed Lowland' }
  ];

  const barangayOptions = [
    'Bagocboc', 'Barra', 'Bonbon', 'Buruanga', 'Cabadiangan', 'Camaman-an',
    'Gotokan', 'Igpit', 'Limbaybay', 'Lower Olave', 'Lumbia', 'Malitbog',
    'Mapayag', 'Napaliran', 'Opol Poblacion', 'Patag', 'Pontod', 'San Vicente',
    'Tingalan', 'Taboc', 'Talakag', 'Upper Olave'
  ];

  const handleParcelChange = (index, field, value) => {
    updateFarmParcel(index, field, value);
  };

  const handleAddParcel = () => {
    addFarmParcel();
  };

  const handleRemoveParcel = (index) => {
    // eslint-disable-next-line no-alert
    if (window.confirm('Are you sure you want to remove this farm parcel?')) {
      removeFarmParcel(index);
    }
  };

  return (
    <Box>
      {/* Section Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <LandscapeIcon sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" component="h2" fontWeight="bold" color="primary">
            Farm Parcels
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Provide details about your farm land ownership and cultivation areas
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddParcel}
          sx={{ borderRadius: 2 }}
        >
          Add Parcel
        </Button>
      </Box>

      {/* Error message for missing parcels */}
      {errors.farmParcels && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {errors.farmParcels}
        </Alert>
      )}

      {/* Farm Parcels List */}
      {farmParcels.length === 0 ? (
        <Card variant="outlined" sx={{ borderRadius: 2, textAlign: 'center', py: 6 }}>
          <CardContent>
            <LocationIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Farm Parcels Added
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              You need to add at least one farm parcel to continue with your RSBSA registration.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddParcel}
              size="large"
            >
              Add Your First Farm Parcel
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {farmParcels.map((parcel, index) => (
            <Grid item xs={12} key={parcel.id || index}>
              <Accordion 
                defaultExpanded={index === farmParcels.length - 1}
                sx={{ 
                  borderRadius: 2, 
                  '&:before': { display: 'none' },
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                }}
              >
                <AccordionSummary 
                  expandIcon={<ExpandMoreIcon />}
                  sx={{ 
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    borderRadius: '8px 8px 0 0',
                    '&.Mui-expanded': {
                      borderRadius: '8px 8px 0 0'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', mr: 2 }}>
                    <Typography variant="h6" fontWeight="bold">
                      Farm Parcel #{index + 1}
                      {parcel.parcel_number && ` - ${parcel.parcel_number}`}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip 
                        label={`${parcel.farm_area || 0} hectares`}
                        size="small"
                        sx={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                          color: 'inherit'
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveParcel(index);
                        }}
                        sx={{ color: 'inherit' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </AccordionSummary>

                <AccordionDetails sx={{ p: 3 }}>
                  <Grid container spacing={3}>
                    {/* Basic Parcel Information */}
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom color="primary">
                        Basic Information
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Parcel Number/Name"
                        value={parcel.parcel_number || ''}
                        onChange={(e) => handleParcelChange(index, 'parcel_number', e.target.value)}
                        error={!!errors[`farmParcels.${index}.parcel_number`]}
                        helperText={errors[`farmParcels.${index}.parcel_number`] || 'Optional identifier for this parcel'}
                        placeholder="e.g., Lot 1, Parcel A, North Field"
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth error={!!errors[`farmParcels.${index}.barangay`]}>
                        <InputLabel>Barangay *</InputLabel>
                        <Select
                          value={parcel.barangay || ''}
                          onChange={(e) => handleParcelChange(index, 'barangay', e.target.value)}
                          label="Barangay *"
                        >
                          {barangayOptions.map((barangay) => (
                            <MenuItem key={barangay} value={barangay}>
                              {barangay}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors[`farmParcels.${index}.barangay`] && (
                          <FormHelperText>{errors[`farmParcels.${index}.barangay`]}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Farm Area (hectares) *"
                        type="number"
                        value={parcel.farm_area || ''}
                        onChange={(e) => handleParcelChange(index, 'farm_area', parseFloat(e.target.value) || 0)}
                        error={!!errors[`farmParcels.${index}.farm_area`]}
                        helperText={errors[`farmParcels.${index}.farm_area`] || 'Enter area in hectares (e.g., 1.5)'}
                        inputProps={{ min: 0, step: 0.01 }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth error={!!errors[`farmParcels.${index}.tenure_type`]}>
                        <InputLabel>Tenure Type *</InputLabel>
                        <Select
                          value={parcel.tenure_type || ''}
                          onChange={(e) => handleParcelChange(index, 'tenure_type', e.target.value)}
                          label="Tenure Type *"
                        >
                          {tenureTypeOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors[`farmParcels.${index}.tenure_type`] && (
                          <FormHelperText>{errors[`farmParcels.${index}.tenure_type`]}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Ownership Document Number"
                        value={parcel.ownership_document_number || ''}
                        onChange={(e) => handleParcelChange(index, 'ownership_document_number', e.target.value)}
                        placeholder="Title No., Tax Dec No., etc."
                        helperText="Enter document number if available"
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Farm Type</InputLabel>
                        <Select
                          value={parcel.farm_type || ''}
                          onChange={(e) => handleParcelChange(index, 'farm_type', e.target.value)}
                          label="Farm Type"
                        >
                          {farmTypeOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Special Classifications */}
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 2 }}>
                        Special Classifications
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={parcel.is_ancestral_domain || false}
                            onChange={(e) => handleParcelChange(index, 'is_ancestral_domain', e.target.checked)}
                            color="primary"
                          />
                        }
                        label="Ancestral Domain"
                      />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={parcel.is_agrarian_reform_beneficiary || false}
                            onChange={(e) => handleParcelChange(index, 'is_agrarian_reform_beneficiary', e.target.checked)}
                            color="primary"
                          />
                        }
                        label="Agrarian Reform Beneficiary"
                      />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={parcel.is_organic_practitioner || false}
                            onChange={(e) => handleParcelChange(index, 'is_organic_practitioner', e.target.checked)}
                            color="primary"
                          />
                        }
                        label="Organic Practitioner"
                      />
                    </Grid>

                    {/* Remarks */}
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Remarks"
                        multiline
                        rows={3}
                        value={parcel.remarks || ''}
                        onChange={(e) => handleParcelChange(index, 'remarks', e.target.value)}
                        placeholder="Additional information about this parcel (optional)"
                      />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Summary Card */}
      {farmParcels.length > 0 && (
        <Card variant="outlined" sx={{ mt: 3, borderRadius: 2, backgroundColor: 'background.default' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary">
              Farm Parcels Summary
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Total Parcels:</strong> {farmParcels.length}
                </Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Total Area:</strong> {farmParcels.reduce((sum, parcel) => sum + (parcel.farm_area || 0), 0).toFixed(2)} hectares
                </Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Owned:</strong> {farmParcels.filter(p => p.tenure_type === 'registered_owner').length}
                </Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Organic:</strong> {farmParcels.filter(p => p.is_organic_practitioner).length}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Information Card */}
      <Card variant="outlined" sx={{ mt: 3, borderRadius: 2, backgroundColor: 'info.light', color: 'info.contrastText' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Important Notes About Farm Parcels
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Typography variant="body2">
                <strong>Required Information:</strong> Each parcel must have a barangay, tenure type, and farm area specified.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2">
                <strong>Multiple Parcels:</strong> Add all parcels you cultivate, even if they're in different barangays.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2">
                <strong>Accurate Area:</strong> Provide accurate farm area measurements as this affects program eligibility.
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default FarmParcelsSection;