import React from 'react'
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
  IconButton,
  Button,
  TextField
} from '@mui/material';
import Logo from '../../components/icons/Logo';

function Reg() {
  return (
    <Stack spacing={2} width={'100%'} maxWidth={'sm'} borderRadius={'10px 10px 5px 5px'} bgcolor={'white'} padding={'10px'} boxShadow={'0 30px 40px rgba(0,0,0,.2)'}>
      <Stack bgcolor="#444444" alignContent={'center'} alignItems={'center'} borderRadius={'10px 10px 0px 0px'}>
      <IconButton size="large" edge="start" sx={{ p: 0, flexDirection:'end', bgcolor:"#444444", marginTop:'5px',boxShadow:'-1px 4px 8px 5px rgb(0 0 0 / 33%);'}} href="/">
          <Logo />
        </IconButton>
        <Typography variant='h5' paddingBottom={'5px'} sx={{textShadow:'-1px 4px black'}} align='center' color='primary.contrastText'>Регистрация</Typography>
      </Stack>

      <FormControl
      fullWidth
      color='primary'>
        <TextField id="outlined-basic" label="Телефон" variant="filled" size='small'/>
      </FormControl>

      <FormControl
      fullWidth
      color='primary'>
        <TextField id="outlined-basic" label="E-mail" variant="filled" size='small'/>
      </FormControl>

      <FormControl
      fullWidth
      color='primary'>
        <TextField id="outlined-basic" label="Имя" helperText="Как к вам обращаться?" variant="filled" size='small' />
      </FormControl>

      <FormControl
      fullWidth
      color='primary'>
        <TextField id="outlined-basic" type='password' label="Пароль" variant="filled" size='small'/>
      </FormControl>

      <FormControl
      fullWidth
      color='primary'>
        <TextField id="outlined-basic" type='password' label="Повторите пароль" variant="filled" size='small'/>
      </FormControl>

      <FormControl>
        <Button variant='contained' color='primary'>
          Submit
        </Button>
      </FormControl>

      <Button variant='text' sx={{padding:0}} color='secondary' href='/auth'>
        На страницу входа
      </Button>
    </Stack>
  )
}

export default Reg