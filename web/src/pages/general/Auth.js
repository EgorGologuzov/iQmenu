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
      <Stack bgcolor="#444444" alignContent={'center'} alignItems={'center'} borderRadius={'10px 10px 0px 0px'}>
      <IconButton size="large" edge="start" sx={{ p: 0, flexDirection:'end', bgcolor:"#444444", marginTop:'5px',boxShadow:'-1px 4px 8px 5px rgb(0 0 0 / 33%);'}} href="/">
          <Logo />
        </IconButton>
        <Typography variant='h5' paddingBottom={'5px'} sx={{textShadow:'-1px 4px black'}} align='center' color='primary.contrastText'>Авторизация</Typography>
      </Stack>
      <FormControl
      fullWidth
      variant="outlined"
      color='primary'>
        <InputLabel size="small" htmlFor="outlined-adornment-password">
          Телефон
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
      <Button variant='text' sx={{padding:0}} color='secondary' href='/reg'>
        Зарегистрироваться
      </Button>
    </Stack>
  )
}

export default Auth