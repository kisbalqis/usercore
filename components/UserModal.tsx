
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Box, 
  Typography, 
  IconButton,
  Avatar,
  Divider,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { X, Save, User as UserIcon, Building, MapPin, AtSign, Globe, PhoneCall } from 'lucide-react';
import { User } from '../types';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User | null;
  mode: 'add' | 'edit' | 'view';
  onSubmit: (user: User) => Promise<void>;
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, user, mode, onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({
    name: '',
    username: '',
    email: '',
    phone: '',
    website: '',
    company: { name: '', catchPhrase: '' },
    address: { street: '', suite: '', city: '', zipcode: '' },
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (isOpen) {
      if (user && (mode === 'edit' || mode === 'view')) {
        setFormData(user);
      } else {
        setFormData({
          name: '',
          username: '',
          email: '',
          phone: '',
          website: '',
          company: { name: '', catchPhrase: '' },
          address: { street: '', suite: '', city: '', zipcode: '' },
        });
      }
      setErrors({});
    }
  }, [user, mode, isOpen]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name?.trim()) newErrors.name = 'Name is required';
    if (!formData.username?.trim()) newErrors.username = 'Username is required';
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'view') return;
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData as User);
      onClose();
    } catch (err) {
      console.error("Submission failed", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isViewOnly = mode === 'view';

  return (
    <Dialog 
      open={isOpen} 
      onClose={isSubmitting ? undefined : onClose} 
      fullWidth 
      maxWidth="md"
      PaperProps={{
        sx: { borderRadius: 3 }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography variant="h6" fontWeight="bold">
          {mode === 'add' ? 'Add New User' : mode === 'edit' ? 'Edit User' : 'User Details'}
        </Typography>
        <IconButton onClick={onClose} size="small" disabled={isSubmitting}>
          <X size={20} />
        </IconButton>
      </DialogTitle>
      
      <Divider />

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ py: 3 }}>
          <Grid container spacing={4}>
            {isViewOnly && user && (
              <Grid size={12}>
                <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                  <Avatar 
                    src={user.imageUrl} 
                    sx={{ width: 100, height: 100, mb: 2, border: '4px solid', borderColor: 'primary.light' }}
                  />
                  <Typography variant="h5" fontWeight="bold">{user.name}</Typography>
                  <Typography variant="body1" color="primary">@{user.username}</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
              </Grid>
            )}

            <Grid size={{ xs: 12, md: 6 }}>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <UserIcon size={18} style={{ color: '#3f51b5' }} />
                <Typography variant="subtitle2" color="textSecondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                  Basic Info
                </Typography>
              </Box>
              <Box display="flex" flexDirection="column" gap={2}>
                <TextField
                  label="Full Name"
                  fullWidth
                  required
                  disabled={isViewOnly}
                  error={!!errors.name}
                  helperText={errors.name}
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <TextField
                  label="Username"
                  fullWidth
                  required
                  disabled={isViewOnly}
                  error={!!errors.username}
                  helperText={errors.username}
                  value={formData.username || ''}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">@</InputAdornment>,
                  }}
                />
                <TextField
                  label="Email Address"
                  fullWidth
                  required
                  type="email"
                  disabled={isViewOnly}
                  error={!!errors.email}
                  helperText={errors.email}
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Building size={18} style={{ color: '#3f51b5' }} />
                <Typography variant="subtitle2" color="textSecondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                  Professional
                </Typography>
              </Box>
              <Box display="flex" flexDirection="column" gap={2}>
                <TextField
                  label="Phone Number"
                  fullWidth
                  disabled={isViewOnly}
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                <TextField
                  label="Website URL"
                  fullWidth
                  disabled={isViewOnly}
                  value={formData.website || ''}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                />
                <TextField
                  label="Company Name"
                  fullWidth
                  disabled={isViewOnly}
                  value={formData.company?.name || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    company: { ...(formData.company || { catchPhrase: '' }), name: e.target.value } 
                  })}
                />
              </Box>
            </Grid>

            <Grid size={12}>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <MapPin size={18} style={{ color: '#3f51b5' }} />
                <Typography variant="subtitle2" color="textSecondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                  Location Details
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Street"
                    fullWidth
                    disabled={isViewOnly}
                    value={formData.address?.street || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      address: { ...(formData.address || { suite: '', city: '', zipcode: '' }), street: e.target.value } 
                    })}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Suite / Apt"
                    fullWidth
                    disabled={isViewOnly}
                    value={formData.address?.suite || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      address: { ...(formData.address || { street: '', city: '', zipcode: '' }), suite: e.target.value } 
                    })}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="City"
                    fullWidth
                    disabled={isViewOnly}
                    value={formData.address?.city || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      address: { ...(formData.address || { street: '', suite: '', zipcode: '' }), city: e.target.value } 
                    })}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Zipcode"
                    fullWidth
                    disabled={isViewOnly}
                    value={formData.address?.zipcode || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      address: { ...(formData.address || { street: '', suite: '', city: '' }), zipcode: e.target.value } 
                    })}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={onClose} color="inherit" disabled={isSubmitting}>
            {isViewOnly ? 'Close' : 'Cancel'}
          </Button>
          {!isViewOnly && (
            <Button 
              type="submit" 
              variant="contained" 
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : <Save size={18} />}
              disableElevation
            >
              {isSubmitting ? 'Saving...' : (mode === 'add' ? 'Add User Member' : 'Save Changes')}
            </Button>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UserModal;
