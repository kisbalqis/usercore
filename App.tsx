
import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  Box, 
  Button, 
  TextField, 
  InputAdornment, 
  Fab, 
  Alert, 
  IconButton,
  Tooltip,
  Paper,
  Snackbar
} from '@mui/material';
// Fix: Import Grid from @mui/material/Grid2 as it is not exported directly from @mui/material in this version
import Grid from '@mui/material/Grid2';
import { UserProvider, useUserContext } from './UserContext';
import { User } from './types';
import UserCard from './components/UserCard';
import UserModal from './components/UserModal';
import LoadingSkeleton from './components/LoadingSkeleton';
import ConfirmDialog from './components/ConfirmDialog';
import { Plus, Search, Users, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { 
    filteredUsers, 
    loading, 
    error, 
    addUser, 
    updateUser, 
    deleteUser, 
    refreshUsers,
    searchTerm,
    setSearchTerm,
    users
  } = useUserContext();

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: 'add' | 'edit' | 'view';
    selectedUser: User | null;
  }>({
    isOpen: false,
    mode: 'view',
    selectedUser: null,
  });

  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    userId: number | null;
  }>({
    isOpen: false,
    userId: null,
  });

  useEffect(() => {
    refreshUsers();
  }, [refreshUsers]);

  const openModal = (mode: 'add' | 'edit' | 'view', user: User | null = null) => {
    setModalState({ isOpen: true, mode, selectedUser: user });
  };

  const handleModalSubmit = async (userData: User) => {
    try {
      if (modalState.mode === 'add') {
        addUser(userData);
        setSnackbar({ open: true, message: 'Member added successfully', severity: 'success' });
      } else {
        updateUser(userData);
        setSnackbar({ open: true, message: 'Profile updated successfully', severity: 'success' });
      }
    } catch (err) {
      setSnackbar({ open: true, message: 'Operation failed', severity: 'error' });
    }
  };

  const initiateDelete = (id: number) => {
    setDeleteDialog({ isOpen: true, userId: id });
  };

  const confirmDelete = () => {
    if (deleteDialog.userId) {
      deleteUser(deleteDialog.userId);
      setSnackbar({ open: true, message: 'Member removed from team', severity: 'success' });
    }
    setDeleteDialog({ isOpen: false, userId: null });
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', pb: 8, bgcolor: 'background.default' }}>
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'white', color: 'text.primary', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ gap: 2 }}>
            <Box display="flex" alignItems="center" gap={1.5} sx={{ cursor: 'pointer' }} onClick={() => refreshUsers()}>
              <Box sx={{ bgcolor: 'primary.main', p: 1, borderRadius: 2, display: 'flex' }}>
                <Users color="white" size={24} />
              </Box>
              <Typography variant="h6" fontWeight="bold" sx={{ display: { xs: 'none', sm: 'block' } }}>
                UserCore
              </Typography>
            </Box>

            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
              <TextField 
                size="small"
                placeholder="Search by name, email or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ 
                  width: { xs: '100%', md: 500 },
                  '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'grey.50' } 
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={18} color="#999" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Button 
              variant="contained" 
              startIcon={<Plus size={18} />} 
              onClick={() => openModal('add')}
              sx={{ display: { xs: 'none', sm: 'flex' } }}
              disableElevation
            >
              Add User
            </Button>
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} mb={4} gap={2}>
          <Box>
            <Typography variant="h4" fontWeight="bold">User Management</Typography>
            <Typography variant="body1" color="textSecondary">Manage all team members and their organizational data.</Typography>
          </Box>
          
          <Box display="flex" alignItems="center" gap={2}>
            <Tooltip title="Refresh data">
              <IconButton onClick={() => refreshUsers()} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
              </IconButton>
            </Tooltip>
            <Paper variant="outlined" sx={{ px: 2, py: 1, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" color="primary" fontWeight="bold">{filteredUsers.length}</Typography>
              <Typography variant="body2" color="textSecondary">Active</Typography>
            </Paper>
          </Box>
        </Box>

        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <Alert severity="error" sx={{ borderRadius: 3 }}>{error}</Alert>
        ) : filteredUsers.length === 0 ? (
          <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 4, border: '2px dashed', borderColor: 'divider', bgcolor: 'transparent' }}>
            <Typography variant="h6" color="textSecondary">No results found for "{searchTerm}"</Typography>
            <Button sx={{ mt: 2 }} onClick={() => setSearchTerm('')}>Clear Search</Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredUsers.map((user) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={user.id}>
                <UserCard 
                  user={user}
                  onEdit={(u) => openModal('edit', u)}
                  onDelete={initiateDelete}
                  onView={(u) => openModal('view', u)}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <Fab 
        color="primary" 
        sx={{ position: 'fixed', bottom: 24, right: 24, display: { sm: 'none' } }}
        onClick={() => openModal('add')}
      >
        <Plus size={24} />
      </Fab>

      <UserModal 
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        mode={modalState.mode}
        user={modalState.selectedUser}
        onSubmit={handleModalSubmit}
      />

      <ConfirmDialog 
        open={deleteDialog.isOpen}
        title="Remove Member?"
        message="Are you sure you want to remove this member? This action cannot be undone in the local session."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteDialog({ isOpen: false, userId: null })}
      />

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert variant="filled" severity={snackbar.severity} sx={{ borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </Box>
  );
};

const App: React.FC = () => (
  <UserProvider>
    <Dashboard />
  </UserProvider>
);

export default App;
