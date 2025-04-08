import React from 'react'
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
  IconButton,
  Button
} from '@mui/material';
import Logo from '../../components/icons/Logo';

function Auth() {
  return (
    <Stack spacing={2} width={'100%'} maxWidth={'sm'} borderRadius={'10px 10px 5px 5px'} bgcolor={'white'} padding={'10px'} boxShadow={'0 30px 40px rgba(0,0,0,.2)'}>
      <Stack direction={'row'} justifyContent={'center'} bgcolor="#444444" spacing={2} alignContent={'center'} alignItems={'center'} borderRadius={'10px 10px 0px 0px'}>
      <Typography variant='h5' align='center' height={'min-content'} color='primary.contrastText'>Авторизация</Typography>
        <IconButton size="large" edge="start" sx={{ p: 1, bgcolor:"#444444" }} href="/">
          <Logo />
        </IconButton>
      </Stack>
      <FormControl
      fullWidth
      variant="outlined"
      color='primary'>
        <InputLabel size="small" htmlFor="outlined-adornment-password">
          Логин
        </InputLabel>
        <OutlinedInput
          id="outlined-adornment-password"
          type='text'
          name="password"
          size="small"
          label="Пароль"
        />
      </FormControl>
      <FormControl
      fullWidth
      variant="outlined"
      color='primary'>
        <InputLabel size="small" htmlFor="outlined-adornment-password">
          Пароль
        </InputLabel>
        <OutlinedInput
          id="outlined-adornment-password"
          type={'password'}
          name="password"
          size="small"
          label="Пароль"
        />
      </FormControl>
      <FormControl>
        <Button variant='contained' color='primary'>
          Submit
        </Button>
      </FormControl>
    </Stack>
  )
}

export default Auth