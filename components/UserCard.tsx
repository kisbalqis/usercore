
import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  IconButton, 
  Button, 
  Stack, 
  Tooltip,
  Divider,
  Avatar
} from '@mui/material';
import { Mail, Phone, Globe, Trash2, Edit2, Eye, Building2 } from 'lucide-react';
import { User } from '../types';

interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
  onView: (user: User) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onEdit, onDelete, onView }) => {
  return (
    <Card 
      elevation={0}
      sx={{ 
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 4,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: '0 12px 24px -10px rgba(0,0,0,0.1)',
          borderColor: 'primary.light',
          '& .action-overlay': { opacity: 1 }
        }
      }}
    >
      <Box sx={{ height: 80, bgcolor: 'primary.light', opacity: 0.1, position: 'absolute', top: 0, left: 0, right: 0 }} />
      
      <CardContent sx={{ pt: 4, flexGrow: 1, position: 'relative' }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Avatar 
            src={user.imageUrl} 
            variant="rounded"
            sx={{ 
              width: 64, 
              height: 64, 
              borderRadius: 3, 
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              border: '3px solid white'
            }}
          />
          <Stack direction="row" spacing={0.5} className="action-overlay" sx={{ opacity: 0.6, transition: 'opacity 0.2s' }}>
            <Tooltip title="Edit">
              <IconButton size="small" onClick={() => onEdit(user)} sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main', bgcolor: 'primary.50' } }}>
                <Edit2 size={16} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton size="small" onClick={() => onDelete(user.id)} sx={{ color: 'text.secondary', '&:hover': { color: 'error.main', bgcolor: 'error.50' } }}>
                <Trash2 size={16} />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>

        <Typography variant="h6" fontWeight="800" sx={{ lineHeight: 1.2, mb: 0.5 }}>
          {user.name}
        </Typography>
        <Typography variant="body2" color="primary" fontWeight="600" sx={{ mb: 2 }}>
          @{user.username}
        </Typography>

        <Stack spacing={1.2}>
          <Box display="flex" alignItems="center" gap={1.5}>
            <Mail size={14} color="#64748b" />
            <Typography variant="body2" color="text.secondary" noWrap sx={{ fontSize: '0.8125rem' }}>
              {user.email}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1.5}>
            <Building2 size={14} color="#64748b" />
            <Typography variant="body2" color="text.secondary" noWrap sx={{ fontSize: '0.8125rem' }}>
              {user.company.name}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1.5}>
            <Globe size={14} color="#64748b" />
            <Typography variant="body2" color="text.secondary" noWrap sx={{ fontSize: '0.8125rem' }}>
              {user.website}
            </Typography>
          </Box>
        </Stack>
      </CardContent>

      <Box p={2} pt={0}>
        <Button 
          fullWidth 
          variant="outlined" 
          startIcon={<Eye size={16} />}
          onClick={() => onView(user)}
          sx={{ 
            borderRadius: 2, 
            textTransform: 'none', 
            fontWeight: 600,
            borderColor: 'divider',
            color: 'text.primary',
            '&:hover': { bgcolor: 'primary.main', color: 'white', borderColor: 'primary.main' }
          }}
        >
          Profile Details
        </Button>
      </Box>
    </Card>
  );
};

export default UserCard;
