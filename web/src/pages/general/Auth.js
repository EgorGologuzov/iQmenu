import React from 'react'
import {
  FormControl,
  InputLabel,
  Stack,
  Typography,
  IconButton,
  Button,
  TextField
} from '@mui/material';
import Logo from '../../components/icons/Logo';
import PasswordInput from '../../components/inputs/PasswordInput';
import { useNavigate } from 'react-router';

function Auth() {

  const navigate = useNavigate();

  return (
    <Stack spacing={2} width={'100%'} maxWidth="sm" borderRadius={1} bgcolor={'white'} padding={'10px'} boxShadow={'0 30px 40px rgba(0,0,0,.2)'}>
      <Stack bgcolor="#444444" alignContent={'center'} alignItems={'center'} borderRadius={'10px 10px 0px 0px'}>
        <IconButton size="large" edge="start" sx={{ p: 0, flexDirection: 'end', bgcolor: "#444444", marginTop: '5px', boxShadow: '-1px 4px 8px 5px rgb(0 0 0 / 33%);' }} href="/">
          <Logo />
        </IconButton>
        <Typography variant='h5' paddingBottom={'5px'} sx={{ textShadow: '-1px 4px black' }} align='center' color='primary.contrastText'>Авторизация</Typography>
      </Stack>
      <FormControl
        fullWidth
        variant="outlined"
        color='primary'>
        <TextField
          type='text'
          id="phone"
          size="small"
          label="Телефон"
        />
      </FormControl>
      <FormControl
        fullWidth
        variant="outlined"
        color='primary'>
        <PasswordInput
          id="password"
          size="small"
          label="Пароль"
        />
      </FormControl>
      <FormControl>
        <Button variant='contained' color='primary'>
          Войти
        </Button>
      </FormControl>
      <Button variant='text' color='secondary' onClick={() => navigate('/reg')}>
        Зарегистрироваться
      </Button>
    </Stack>
  )
}

export default Auth