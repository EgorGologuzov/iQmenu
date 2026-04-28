import React, { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import useIQmenuApi from '../../hooks/useIQmenuApi';
import { useDispatch } from 'react-redux';
import { IMaskInput } from 'react-imask'
import {
  FormControl,
  Stack,
  Typography,
  IconButton,
  Button,
  TextField,
  Alert,
  FormHelperText,
  Box,
} from '@mui/material';
import Logo from '../../components/icons/Logo';
import PasswordInput from '../../components/inputs/PasswordInput';
import { useNavigate } from 'react-router';
import { setUserData } from '../../store/slices/userSlice';
import PhoneInputMask from '../../components/inputs/PhoneInputMask';
import useTitle from '../../hooks/useTitle';


function Auth() {
  const [authData, setAuthData] = useState({});

  const api = useIQmenuApi();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { mutate: authorizeUser, error: mutationError, isPending: isMutationPending } = useMutation({
    mutationFn: (data) => api.user.auth(data),
    mutationKey: ['api.user.auth'],
  })

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!isMutationPending) {
      authorizeUser(authData, {
        onSuccess: (data) => {
          dispatch(setUserData(data))
          navigate('/o');
        }
      })
    }
  }

  useTitle({ general: "Авторизация" });

  return (
    <Stack direction="column" sx={{ p: 1, width: "100%", maxWidth: "400px", bgcolor: 'primary.contrastText', borderRadius: "8px" }}>

      <Stack
        direction="column"
        spacing={1}
        sx={{ width: "100%", mb: 2 }}>
        <Box
            component="img"
            sx={{ width: "100%", objectFit: "cover", borderRadius: "4px", minHeight: "60px" }}
            src="/logo-line.svg"
            alt="/logo-line.svg"
          />
        <Typography variant='h6' sx={{ textAlign: "center" }}>АВТОРИЗАЦИЯ</Typography>
      </Stack>

      <form onSubmit={onSubmit}>
        <Stack spacing={2}>

          <FormControl
            fullWidth
            variant="outlined"
            color='primary'>
            <TextField
              name="login"
              label="Телефон"
              variant="outlined"
              size='small'
              required
              slotProps={{ inputLabel: { shrink: true }, input: { inputComponent: PhoneInputMask } }}
              placeholder="+7(___)___-__-__"
              value={authData.phone}
              onChange={(event) => setAuthData({ ...authData, phone: event.target.value })}
            />
          </FormControl>

          <FormControl
            fullWidth
            variant="outlined"
            color='primary'>
            <PasswordInput
              name="password"
              autoComplete='current-password'
              size="small"
              required
              label="Пароль"
              value={authData.password ?? ""}
              onChange={(event) => setAuthData({ ...authData, password: event.target.value })}
            />
          </FormControl>

          <FormControl>
            <Button variant='contained' type='submit' color='primary' loading={isMutationPending}>
              Войти
            </Button>
          </FormControl>

        </Stack>
      </form>

      <Button
        variant='text'
        color='secondary'
        onClick={() => navigate('/reg')}
        sx={{ mt: 1 }}>
        Зарегистрироваться
      </Button>

      {mutationError && <Alert severity="error" sx={{ mt: 1 }}>{mutationError.message}</Alert>}
    </Stack>
  )
}

export default Auth