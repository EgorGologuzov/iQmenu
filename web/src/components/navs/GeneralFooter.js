import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { styled } from '@mui/material/styles';

const FooterWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(1, 0),
  marginTop: 'auto',
}));

function GeneralFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <FooterWrapper component="footer">
      <Container>
        <Box
          display="flex"
          flexDirection={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="body1" color="inherit">
            <b>iQmenu</b> — цифровые меню для ресторанов и кафе
          </Typography>
          <Typography variant="body1" color="inherit">
            © {currentYear} <b>iQmenu</b>. Все права защищены.
          </Typography>
        </Box>
      </Container>
    </FooterWrapper>
  );
};

export default GeneralFooter;