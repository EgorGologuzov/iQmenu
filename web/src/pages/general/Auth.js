import React from 'react'
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query'
import useIQmenuApi from '../../hooks/useIQmenuApi';
import { useDispatch } from 'react-redux';
import {
  FormControl,
  Stack,
  Typography,
  IconButton,
  Button,
  TextField,
  Alert
} from '@mui/material';
import Logo from '../../components/icons/Logo';
import PasswordInput from '../../components/inputs/PasswordInput';
import { useNavigate } from 'react-router';
import { setUserData } from '../../store/slices/userSlice';

function Auth() {
  const navigate = useNavigate();
  const api=useIQmenuApi(); 
  const dispatch=useDispatch();
  const {
    register,
    handleSubmit,
    getValues,
  } = useForm();

  const { mutate: authorizeUser, error: mutationError, isPending: isMutationPending }=useMutation({
    mutationFn: (data)=>api.user.auth(data),
    mutationKey: ['Auth'],
  })

  const onSubmit = async () => {
    authorizeUser(getValues(),{onSuccess: (data)=> 
    {
      console.log(localStorage.getItem('userSlice/user'))
      dispatch(setUserData(data))
      navigate('/o');
    }
  })
  }

  return (
    <Stack spacing={2} width={'100%'} maxWidth="sm" borderRadius={1} bgcolor={'white'} padding={'10px'} boxShadow={'0 30px 40px rgba(0,0,0,.2)'}>
      <Stack bgcolor="#444444" alignContent={'center'} alignItems={'center'} borderRadius={'10px 10px 0px 0px'}>
        <IconButton size="large" edge="start" sx={{ p: 0, flexDirection: 'end', bgcolor: "#444444", marginTop: '5px', boxShadow: '-1px 4px 8px 5px rgb(0 0 0 / 33%);' }} href="/">
          <Logo />
        </IconButton>
        <Typography variant='h5' paddingBottom={'5px'} sx={{ textShadow: '-1px 4px black' }} align='center' color='primary.contrastText'>Авторизация</Typography>
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
        <FormControl
          fullWidth
          variant="outlined"
          required
          color='primary'>
          <TextField
            type='text'
            id="phone"
            size="small"
            required
            label="Телефон"
            {...register('phone',{required:true})}
          />
        </FormControl>
        <FormControl
          fullWidth
          variant="outlined"
          color='primary'
          required>
          <PasswordInput
            id="password"
            autoComplete='current-password'
            size="small"
            label="Пароль"
            {...register('password',{required:true})}
          />
        </FormControl>
        <FormControl>
          <Button variant='contained' type='submit' color='primary' loading={isMutationPending}>
            Войти
          </Button>
        </FormControl>
        </Stack>
      </form>
      {mutationError&&<Alert severity="error">{mutationError.message}</Alert>}
      <Button variant='text' color='secondary' onClick={() => navigate('/reg')}>
        Зарегистрироваться
      </Button>
    </Stack>
  )
}

export default Auth