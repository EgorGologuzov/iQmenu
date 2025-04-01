import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Logo from '../icons/Logo';
import { Container, IconButton } from '@mui/material';

function PageHeader() {
  const title = "Заголовок страницы"
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Container>
          <Toolbar variant="dense">
            <IconButton size="large" edge="start" color="inherit" aria-label="logo" sx={{ p: 1 }}>
              <Logo />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ ml: 1, display: { xs: 'none', sm: 'block' } }}>
              iQmenu
            </Typography>
            {title && <Typography variant="subtitle1" component="div" sx={{ ml: 1, display: { xs: 'none', sm: 'block' } }}>
              /
            </Typography>}
            {title && <Typography variant="subtitle1" noWrap component="h1" sx={{ ml: 1, flexGrow: 1 }}>
              { title }
            </Typography>}
            <Button color="inherit">Вход</Button>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
}

export default PageHeader