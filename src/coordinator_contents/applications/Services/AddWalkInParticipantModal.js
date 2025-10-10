/* eslint-disable no-useless-escape */
/* eslint-disable camelcase */
/* eslint-disable no-alert */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-vars */
/* eslint-disable no-await-in-loop */
/* eslint-disable react/jsx-no-duplicate-props */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, FormControl, InputLabel, Select, MenuItem,
  Box, Typography, CircularProgress, Alert, Stack, Grid, Card, CardContent, Divider, Autocomplete
} from '@mui/material';
import {
  UserPlus, X, Save, Package, Users, Calendar, MapPin, Info
} from 'lucide-react';

import { useWalkInService } from './useWalkInService';
import { useInventoryStocks } from './useServiceManagement';

const theme = {
  primary: '#2d5016',
  secondary: '#4a7c59',
  success: '#2e7d32',
  warning: '#ed6c02',
  error: '#d32f2f',
  info: '#4a7c59',
  background: '#f8fdf9',
  surface: '#ffffff',
  surfaceVariant: '#e8f5e8',
  outline: '#4a7c59',
  primaryLight: '#e8f5e8',
  successLight: '#e8f5e8',
  warningLight: '#fff3e0',
  errorLight: '#ffebee',
  text: '#333333'
};

const AddWalkInParticipantModal = ({ open, onClose, event, onSuccess }) => {
  const [formData, setFormData] = useState({
    owner_name: '',
    owner_contact: '',
    target_category: '',
    target_breed: '',
    quantity: '',
    unit: 'heads',
    age_months: '',
    sex: 'Unknown',
    service_item: '',
    remarks: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hooks
  const { addWalkInParticipant, loading: walkInActionLoading } = useWalkInService();
  const { data: inventoryStocks, loading: inventoryLoading } = useInventoryStocks();

  // Get service sector to determine field configuration
  const serviceSector = useMemo(() => {
    return event?.service_catalog?.sector_id || event?.service_catalog?.sector?.id;
  }, [event]);

  // Dynamic field configuration based on service sector
  const fieldConfig = useMemo(() => {
    switch (serviceSector) {
      case 5: // Livestock
        return {
          ownerLabel: 'Owner Name',
          ownerHelper: 'Full name of the animal owner',
          categoryLabel: 'Species Category',
          categoryOptions: [
            'Bovine (Cattle)',
            'Bubaline (Carabao/Water Buffalo)',
            'Caprine (Goat)',
            'Ovine (Sheep)',
            'Porcine (Pig/Swine)',
            'Equine (Horse)',
            'Canine (Dog)',
            'Feline (Cat)',
            'Poultry - Chicken',
            'Poultry - Duck',
            'Poultry - Turkey',
            'Poultry - Quail',
            'Leporine (Rabbit)',
            'Other'
          ],
          breedLabel: 'Breed/Variety',
          breedHelper: 'Specific breed or variety',
          breedPlaceholder: 'e.g., Aspin, Persian, Holstein',
          quantityLabel: 'Quantity',
          quantityHelper: 'Number of animals',
          unitOptions: ['heads', 'pcs'],
          defaultUnit: 'heads',
          showAge: true,
          showSex: true,
          ageHelper: 'Age in months (optional)',
          sexOptions: ['Male', 'Female', 'Mixed', 'Unknown']
        };
      case 4: // Fisheries
        return {
          ownerLabel: 'Farmer Name',
          ownerHelper: 'Full name of the fish farmer',
          categoryLabel: 'Species Category',
          categoryOptions: [
            'Tilapia',
            'Bangus (Milkfish)',
            'Catfish',
            'Carp',
            'Shrimp',
            'Crab',
            'Oyster',
            'Mussel',
            'Other'
          ],
          breedLabel: 'Variety/Strain',
          breedHelper: 'Specific variety or strain',
          breedPlaceholder: 'e.g., Nile Tilapia, GIFT Tilapia',
          quantityLabel: 'Quantity',
          quantityHelper: 'Number of fingerlings/fish',
          unitOptions: ['pcs', 'kg'],
          defaultUnit: 'pcs',
          showAge: false,
          showSex: false,
          ageHelper: '',
          sexOptions: []
        };
      case 1: // Rice
        return {
          ownerLabel: 'Farmer Name',
          ownerHelper: 'Full name of the rice farmer',
          categoryLabel: 'Rice Variety',
          categoryOptions: [
            'IR64',
            'NSIC Rc 222',
            'NSIC Rc 160',
            'NSIC Rc 216',
            'NSIC Rc 218',
            'NSIC Rc 300',
            'NSIC Rc 302',
            'Other'
          ],
          breedLabel: 'Seed Type',
          breedHelper: 'Type of rice seed',
          breedPlaceholder: 'e.g., Certified, Hybrid, Inbred',
          quantityLabel: 'Area',
          quantityHelper: 'Area in hectares',
          unitOptions: ['ha', 'sqm'],
          defaultUnit: 'ha',
          showAge: false,
          showSex: false,
          ageHelper: '',
          sexOptions: []
        };
      case 2: // Corn
        return {
          ownerLabel: 'Farmer Name',
          ownerHelper: 'Full name of the corn farmer',
          categoryLabel: 'Corn Variety',
          categoryOptions: [
            'Yellow Corn',
            'White Corn',
            'Sweet Corn',
            'Popcorn',
            'Other'
          ],
          breedLabel: 'Seed Type',
          breedHelper: 'Type of corn seed',
          breedPlaceholder: 'e.g., Hybrid, Open Pollinated',
          quantityLabel: 'Area',
          quantityHelper: 'Area in hectares',
          unitOptions: ['ha', 'sqm'],
          defaultUnit: 'ha',
          showAge: false,
          showSex: false,
          ageHelper: '',
          sexOptions: []
        };
      case 3: // HVC (High Value Crops)
        return {
          ownerLabel: 'Farmer Name',
          ownerHelper: 'Full name of the farmer',
          categoryLabel: 'Crop Type',
          categoryOptions: [
            'Vegetables',
            'Fruits',
            'Root Crops',
            'Spices',
            'Herbs',
            'Flowers',
            'Other'
          ],
          breedLabel: 'Variety',
          breedHelper: 'Specific crop variety',
          breedPlaceholder: 'e.g., Tomato, Eggplant, Pepper',
          quantityLabel: 'Area',
          quantityHelper: 'Area in hectares or square meters',
          unitOptions: ['ha', 'sqm'],
          defaultUnit: 'ha',
          showAge: false,
          showSex: false,
          ageHelper: '',
          sexOptions: []
        };
      default: // Generic/Other
        return {
          ownerLabel: 'Participant Name',
          ownerHelper: 'Full name of the participant',
          categoryLabel: 'Category',
          categoryOptions: ['General', 'Other'],
          breedLabel: 'Type',
          breedHelper: 'Specific type or variety',
          breedPlaceholder: 'Enter type or variety',
          quantityLabel: 'Quantity',
          quantityHelper: 'Number or amount',
          unitOptions: ['units', 'pcs', 'kg', 'liters'],
          defaultUnit: 'units',
          showAge: false,
          showSex: false,
          ageHelper: '',
          sexOptions: []
        };
    }
  }, [serviceSector]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!open) {
      setFormData({
        owner_name: '',
        owner_contact: '',
        target_category: '',
        target_breed: '',
        quantity: '',
        unit: fieldConfig.defaultUnit,
        age_months: '',
        sex: 'Unknown',
        service_item: '',
        remarks: ''
      });
      setErrors({});
      setIsSubmitting(false);
    }
  }, [open, fieldConfig.defaultUnit]);

  // Form handlers
  const handleFormChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    
    if (!formData.owner_name.trim()) newErrors.owner_name = `${fieldConfig.ownerLabel} is required`;
    if (!formData.owner_contact.trim()) newErrors.owner_contact = 'Contact number is required';
    if (!formData.target_category.trim()) newErrors.target_category = `${fieldConfig.categoryLabel} is required`;
    if (!formData.quantity || Number(formData.quantity) <= 0) newErrors.quantity = `Valid ${fieldConfig.quantityLabel.toLowerCase()} is required`;
    
    // Validate contact number format (basic validation)
    if (formData.owner_contact.trim() && !/^[\d\s\-\+\(\)]+$/.test(formData.owner_contact.trim())) {
      newErrors.owner_contact = 'Please enter a valid contact number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, fieldConfig]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm() || !event) return;
    
    setIsSubmitting(true);
    try {
      const walkInData = {
        service_event_id: event.id,
        service_catalog_id: event.service_catalog_id,
        owner_name: formData.owner_name.trim(),
        owner_contact: formData.owner_contact.trim(),
        service_item: formData.service_item.trim(),
        target_category: formData.target_category.trim(),
        target_breed: formData.target_breed.trim(),
        quantity: Number(formData.quantity),
        unit: formData.unit.trim(),
        age_months: fieldConfig.showAge && formData.age_months ? Number(formData.age_months) : null,
        sex: fieldConfig.showSex ? (formData.sex || 'Unknown') : null,
        remarks: formData.remarks.trim(),
        status: 'pending'
      };
      
      await addWalkInParticipant(event.id, walkInData);
      
      // Success callback
      if (onSuccess) {
        onSuccess();
      }
      
      // Close modal
      onClose();
      
    } catch (err) {
      console.error('Error adding walk-in participant:', err);
      setErrors({ 
        submit: err.response?.data?.message || 'Failed to add participant. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, event, addWalkInParticipant, onSuccess, onClose, fieldConfig]);

  // Get available inventory items for service_item dropdown
  const availableInventory = useMemo(() => {
    return (inventoryStocks || []).filter(item => (item.quantity_available || 0) > 0);
  }, [inventoryStocks]);

  if (!open || !event) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{ 
        sx: { 
          borderRadius: 3, 
          background: theme.background, 
          minHeight: '70vh' 
        } 
      }}
    >
      <DialogTitle sx={{ pb: 2, background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`, color: 'white' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={2}>
            <UserPlus size={28} />
            <Box>
              <Typography variant="h5" fontWeight={700}>Add Walk-in Participant</Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Register a new participant for this service event
              </Typography>
            </Box>
          </Stack>
          <Button onClick={onClose} sx={{ color: 'white', minWidth: 'auto', p: 1 }}>
            <X size={24} />
          </Button>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {/* Event Info Header */}
        <Card sx={{ m: 2, borderRadius: 2, border: `1px solid ${theme.outline}`, bgcolor: theme.primaryLight }}>
          <CardContent sx={{ p: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                  <Package size={16} color={theme.primary} />
                  <Typography variant="subtitle2" color="text.secondary">Service</Typography>
                </Stack>
                <Typography variant="h6" fontWeight={600} color={theme.primary}>
                  {event.service_catalog?.name || 'N/A'}
                </Typography>
                {event.service_catalog?.sector && (
                  <Typography variant="caption" color="text.secondary">
                    {event.service_catalog.sector.sector_name}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={3}>
                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                  <MapPin size={16} color={theme.primary} />
                  <Typography variant="subtitle2" color="text.secondary">Location</Typography>
                </Stack>
                <Typography variant="body1" fontWeight={600}>{event.barangay}</Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                  <Calendar size={16} color={theme.primary} />
                  <Typography variant="subtitle2" color="text.secondary">Date</Typography>
                </Stack>
                <Typography variant="body1" fontWeight={600}>
                  {new Date(event.service_date).toLocaleDateString('en-US', { 
                    year: 'numeric', month: 'short', day: 'numeric' 
                  })}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Form */}
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom color={theme.primary} sx={{ mb: 3 }}>
            Participant Information
          </Typography>
          
          <Grid container spacing={3}>
            {/* Participant Information */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ color: theme.primary, mb: 2 }}>
                Participant Details
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={`${fieldConfig.ownerLabel} *`}
                value={formData.owner_name}
                onChange={(e) => handleFormChange('owner_name', e.target.value)}
                error={!!errors.owner_name}
                helperText={errors.owner_name || fieldConfig.ownerHelper}
                placeholder={`e.g., Juan Dela Cruz`}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Contact Number *"
                value={formData.owner_contact}
                onChange={(e) => handleFormChange('owner_contact', e.target.value)}
                error={!!errors.owner_contact}
                helperText={errors.owner_contact || 'Mobile or landline number'}
                placeholder="e.g., 09123456789"
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>

            {/* Service-specific Information */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ color: theme.primary, mb: 2 }}>
                {serviceSector === 5 ? 'Animal Information' : serviceSector === 4 ? 'Fish Information' : 'Crop Information'}
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.target_category}>
                <InputLabel>{fieldConfig.categoryLabel} *</InputLabel>
                <Select
                  value={formData.target_category}
                  onChange={(e) => handleFormChange('target_category', e.target.value)}
                  label={`${fieldConfig.categoryLabel} *`}
                >
                  {fieldConfig.categoryOptions.map(option => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                </Select>
                {errors.target_category && (
                  <Typography variant="caption" color="error">{errors.target_category}</Typography>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={fieldConfig.breedLabel}
                value={formData.target_breed}
                onChange={(e) => handleFormChange('target_breed', e.target.value)}
                helperText={fieldConfig.breedHelper}
                placeholder={fieldConfig.breedPlaceholder}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label={`${fieldConfig.quantityLabel} *`}
                type="number"
                value={formData.quantity}
                onChange={(e) => handleFormChange('quantity', e.target.value)}
                error={!!errors.quantity}
                helperText={errors.quantity || fieldConfig.quantityHelper}
                inputProps={{ min: 0.01, step: 0.01 }}
                placeholder="1"
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Unit</InputLabel>
                <Select
                  value={formData.unit}
                  onChange={(e) => handleFormChange('unit', e.target.value)}
                  label="Unit"
                >
                  {fieldConfig.unitOptions.map(option => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            {/* Age field - only for livestock */}
            {fieldConfig.showAge && (
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Age (months)"
                  type="number"
                  value={formData.age_months}
                  onChange={(e) => handleFormChange('age_months', e.target.value)}
                  helperText={fieldConfig.ageHelper}
                  inputProps={{ min: 0, step: 1 }}
                  placeholder="12"
                />
              </Grid>
            )}
            
            {/* Sex field - only for livestock */}
            {fieldConfig.showSex && (
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Sex</InputLabel>
                  <Select
                    value={formData.sex}
                    onChange={(e) => handleFormChange('sex', e.target.value)}
                    label="Sex"
                  >
                    {fieldConfig.sexOptions.map(option => (
                      <MenuItem key={option} value={option}>{option}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>

            {/* Service Information */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ color: theme.primary, mb: 2 }}>
                Service Information
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Autocomplete
                freeSolo
                options={availableInventory.map(item => item.item_name)}
                value={formData.service_item}
                onChange={(event, newValue) => handleFormChange('service_item', newValue || '')}
                loading={inventoryLoading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Service Item"
                    placeholder="Enter or select service item"
                    helperText="Item to be provided (vaccine, medicine, seeds, etc.)"
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Remarks"
                multiline
                rows={3}
                value={formData.remarks}
                onChange={(e) => handleFormChange('remarks', e.target.value)}
                helperText="Additional notes or observations"
                placeholder="Enter any additional remarks..."
              />
            </Grid>
            
            <Grid item xs={12}>
              <Alert severity="info" sx={{ borderRadius: 2, bgcolor: theme.primaryLight }}>
                <Typography variant="body2">
                  <strong>Manual Entry:</strong> Service item and remarks are entered manually. These will be recorded when the service is provided.
                </Typography>
              </Alert>
            </Grid>
          </Grid>
          
          {errors.submit && (
            <Alert severity="error" sx={{ mt: 3, borderRadius: 2 }}>
              {errors.submit}
            </Alert>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, bgcolor: theme.surfaceVariant, gap: 2 }}>
        <Button 
          onClick={onClose} 
          disabled={isSubmitting}
          variant="outlined" 
          sx={{ borderRadius: 2, minWidth: 100 }}
        >
          Cancel
        </Button>
        
        <Button 
          variant="contained" 
          onClick={handleSubmit}
          disabled={isSubmitting || walkInActionLoading}
          startIcon={isSubmitting || walkInActionLoading ? <CircularProgress size={20} color="inherit" /> : <UserPlus size={20} />}
          sx={{ 
            borderRadius: 2, 
            minWidth: 140,
            bgcolor: theme.primary, 
            '&:hover': { bgcolor: theme.primary + 'dd' } 
          }}
        >
          {isSubmitting || walkInActionLoading ? 'Adding...' : 'Add Participant'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddWalkInParticipantModal;
