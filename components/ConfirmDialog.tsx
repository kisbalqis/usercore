
import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  Box 
} from '@mui/material';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  confirmColor?: 'primary' | 'error' | 'warning';
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ 
  open, title, message, onConfirm, onCancel, 
  confirmText = 'Confirm', confirmColor = 'error' 
}) => {
  return (
    <Dialog open={open} onClose={onCancel} PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ color: `${confirmColor}.main`, display: 'flex' }}>
          <AlertTriangle size={24} />
        </Box>
        <Typography variant="h6" fontWeight="bold">{title}</Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" color="textSecondary">
          {message}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={onCancel} color="inherit">Cancel</Button>
        <Button 
          onClick={onConfirm} 
          variant="contained" 
          color={confirmColor} 
          disableElevation
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
