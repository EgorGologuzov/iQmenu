import React from 'react';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Logo from '../icons/Logo';
import { Avatar, Box, Container, IconButton, Stack } from '@mui/material';
import { useSelector } from 'react-redux';
import { Link } from 'react-router';
import CLink from '../utils/CLink';

function OwnerHeader() {
  const title = useSelector(state => state.page.headerTitle);
  const { name, avatar } = useSelector(state => state.user);
  return (
    <AppBar position="static">
      <Container sx={{ pl: 1, pr: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">

          <CLink to="/" noStyles>
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

          <CLink to="/o/me" noStyles>
            <Stack direction="row" spacing={1} alignItems="center" justifySelf="right" sx={{ cursor: "pointer" }}>
              <Typography variant="body1" component="div" noWrap sx={{ display: { xs: 'none', sm: 'block' } }}>
                {name}
              </Typography>
              {avatar && <Avatar alt={name} src={avatar} />}
              {!avatar && <Avatar sx={{ bgcolor: "secondary.main" }}>{name[0]}</Avatar>}
            </Stack>
          </CLink>

        </Stack>
      </Container>
    </AppBar>
  );
}

export default OwnerHeader