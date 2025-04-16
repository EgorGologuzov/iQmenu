import React from 'react';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Logo from '../icons/Logo';
import { Container, IconButton, Stack } from '@mui/material';
import { useSelector } from 'react-redux';
import CLink from '../utils/CLink';

function GeneralHeader() {
  const title = useSelector(state => state.page.headerTitle);
  return (
    <AppBar position="static">
      <Container sx={{ pl: 1, pr: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">

          <CLink to="/" noStyles >
            <IconButton size="large" edge="start" sx={{ p: 1 }}>
              <Logo />
            </IconButton>
          </CLink>

          <Typography variant="h6" component="div" sx={{ display: { xs: 'none', sm: 'block' }, flexGrow: title ? "unset" : 1 }}>
            iQmenu
          </Typography>

          {title && <Typography variant="subtitle1" component="div" sx={{ display: { xs: 'none', sm: 'block' } }}>
            /
          </Typography>}

          {title && <Typography variant="subtitle1" noWrap component="h1" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>}

          <CLink to="/auth" noStyles>
            <Button color="inherit">Вход</Button>
          </CLink>

        </Stack>
      </Container>
    </AppBar>
  );
}

export default GeneralHeader