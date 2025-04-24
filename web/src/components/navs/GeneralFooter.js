import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import CLink from '../utils/CLink';

function GeneralFooter() {
  const currentYear = new Date().getFullYear();
  return (
    <Box component="footer" sx={{
      backgroundColor: "primary.main",
      color: "primary.contrastText",
      py: 1,
      mt: "auto",
    }}>
      <Container>
        <Box
          display="flex"
          flexDirection={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems="center"
        >

          <Typography variant="body1" color="inherit" align="center">
            <CLink to="/">iQmenu</CLink> — цифровые меню для кафе и ресторанов
          </Typography>

          <Typography variant="body1" color="inherit" align="center">
            © {currentYear} iQmenu. Все права защищены.
          </Typography>

        </Box>
      </Container>
    </Box>
  );
};

export default GeneralFooter;