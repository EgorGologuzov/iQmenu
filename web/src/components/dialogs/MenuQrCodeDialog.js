import React from 'react';
import { Dialog, DialogActions, Typography, Button, Chip, Divider, Box, Stack, DialogContent } from '@mui/material';
import QrView from '../controls/QrView';

function MenuQrCodeDialog({qr, onClose, ...otherProps}){
    if(!qr)
        return null

    return (
        <Dialog {...otherProps} onClose={onClose} maxWidth="xs" fullWidth>
    
          <DialogContent sx={{ p: 0 }}>
    
            <QrView
                src={qr}
            />
    
          </DialogContent>
    
          {/* Кнопка закрытия */}
          <DialogActions>
            <Button onClick={onClose} variant="outlined" sx={{ width: "100%" }}>
              Закрыть
            </Button>
          </DialogActions>
    
        </Dialog>
      );
}

export default MenuQrCodeDialog