import React, { useState, useEffect } from 'react';
import {
  Grid,
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
  Alert,
  CircularProgress
} from '@mui/material';
import { Agriculture as AgricultureIcon } from '@mui/icons-material';

const FarmProfileSection = ({ formData, errors, updateField }) => {
  const [livelihoodCategories, setLivelihoodCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock livelihood categories based on database structure
  // In a real application, this would be fetched from the API
  useEffect(() => {
    const fetchLivelihoodCategories = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data based on typical RSBSA livelihood categories
        const categories = [
          {
            id: 1,
            livelihood_category_name: 'Rice Farmer',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 2,
            livelihood_category_name: 'Corn Farmer',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 3,
            livelihood_category_name: 'Vegetable Farmer',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 4,
            livelihood_category_name: 'Fruit Farmer',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 5,
            livelihood_category_name: 'Livestock Raiser',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 6,
            livelihood_category_name: 'Poultry Raiser',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 7,
            livelihood_category_name: 'Fisherfolk',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 8,
            livelihood_category_name: 'Aquaculture',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 9,
            livelihood_category_name: 'Agricultural Worker/Farmworker',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 10,
            livelihood_category_name: 'Agri-Youth',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 11,
            livelihood_category_name: 'Coconut Farmer',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 12,
            livelihood_category_name: 'Sugarcane Farmer',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 13,
            livelihood_category_name: 'Coffee Farmer',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 14,
            livelihood_category_name: 'Cacao Farmer',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 15,
            livelihood_category_name: 'Mixed Farming',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
        
        setLivelihoodCategories(categories);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching livelihood categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLivelihoodCategories();
  }, []);

  const handleFieldChange = (field, value) => {
    updateField(field, value);
  };

  const selectedCategory = livelihoodCategories.find(
    category => category.id === formData.livelihood_category_id
  );

  return (
    <Box>
      {/* Section Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <AgricultureIcon sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
        <Box>
          <Typography variant="h4" component="h2" fontWeight="bold" color="primary">
            Farm Profile
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Select your primary agricultural livelihood activity
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Main Farm Profile Card */}
        <Grid item xs={12}>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center' }}>
                Livelihood Category
                <Chip label="Required" color="error" size="small" sx={{ ml: 2 }} />
              </Typography>
              <Divider sx={{ mb: 3 }} />

              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                  <CircularProgress />
                  <Typography variant="body1" sx={{ ml: 2 }}>
                    Loading livelihood categories...
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <FormControl fullWidth error={!!errors['farmProfile.livelihood_category_id']}>
                      <InputLabel>Primary Livelihood Category *</InputLabel>
                      <Select
                        value={formData.livelihood_category_id || ''}
                        onChange={(e) => handleFieldChange('livelihood_category_id', e.target.value)}
                        label="Primary Livelihood Category *"
                      >
                        {livelihoodCategories.map((category) => (
                          <MenuItem key={category.id} value={category.id}>
                            {category.livelihood_category_name}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors['farmProfile.livelihood_category_id'] && (
                        <FormHelperText>{errors['farmProfile.livelihood_category_id']}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  {selectedCategory && (
                    <Grid item xs={12}>
                      <Alert 
                        severity="info" 
                        sx={{ borderRadius: 2 }}
                      >
                        <Typography variant="h6" gutterBottom>
                          Selected: {selectedCategory.livelihood_category_name}
                        </Typography>
                        <Typography variant="body2">
                          {getLivelihoodDescription(selectedCategory.livelihood_category_name)}
                        </Typography>
                      </Alert>
                    </Grid>
                  )}
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Information Card */}
        <Grid item xs={12}>
          <Card variant="outlined" sx={{ borderRadius: 2, backgroundColor: 'background.default' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                Important Notes
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Primary Livelihood:</strong> Select the agricultural activity that provides most of your income.
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Multiple Activities:</strong> You can specify additional activities in the next sections.
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Category Benefits:</strong> Different categories may qualify for different DA programs.
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

// Helper function to get description for each livelihood category
const getLivelihoodDescription = (categoryName) => {
  const descriptions = {
    'Rice Farmer': 'Engaged in rice production including land preparation, planting, care, and harvesting of rice crops.',
    'Corn Farmer': 'Involved in corn cultivation from planting to harvesting, including both feed and food corn varieties.',
    'Vegetable Farmer': 'Produces various vegetables for commercial or subsistence purposes including leafy greens, root crops, and fruit vegetables.',
    'Fruit Farmer': 'Cultivates fruit-bearing trees and plants such as mango, banana, citrus, and other tropical fruits.',
    'Livestock Raiser': 'Raises farm animals such as cattle, carabao, goats, sheep, and swine for meat, dairy, or draft purposes.',
    'Poultry Raiser': 'Engages in raising chickens, ducks, geese, turkeys, and other birds for eggs, meat, or breeding.',
    'Fisherfolk': 'Involved in capture fisheries using various fishing methods in marine or inland waters.',
    'Aquaculture': 'Practices fish farming, shrimp farming, or other aquatic species cultivation in controlled environments.',
    'Agricultural Worker/Farmworker': 'Provides labor services in agricultural operations including planting, harvesting, and farm maintenance.',
    'Agri-Youth': 'Young individuals (15-30 years old) engaged in agricultural activities or agribusiness ventures.',
    'Coconut Farmer': 'Cultivates coconut palms for copra, coconut oil, and other coconut-based products.',
    'Sugarcane Farmer': 'Grows sugarcane for sugar production or other industrial uses.',
    'Coffee Farmer': 'Cultivates coffee plants and processes coffee beans for local or export markets.',
    'Cacao Farmer': 'Grows cacao trees and processes cacao beans for chocolate and other cocoa products.',
    'Mixed Farming': 'Combines multiple agricultural activities such as crops, livestock, and other farm enterprises.'
  };

  return descriptions[categoryName] || 'Agricultural livelihood activity as specified in the RSBSA registration system.';
};

export default FarmProfileSection;