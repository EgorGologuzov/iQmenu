import React, { useState } from 'react'
import {
  FormControl,
  Alert,
  Stack,
  Typography,
  IconButton,
  Button,
  TextField,
  Box
} from '@mui/material';
import Logo from '../../components/icons/Logo';
import PasswordInput from '../../components/inputs/PasswordInput';
import { useNavigate } from 'react-router';
import useIQmenuApi from '../../hooks/useIQmenuApi';
import { useMutation } from '@tanstack/react-query'
import { useDispatch } from 'react-redux';
import { setUserData } from '../../store/slices/userSlice';
import PhoneInputMask from '../../components/inputs/PhoneInputMask';
import useTitle from '../../hooks/useTitle';
import { validateRegData } from '../../data/models/validation';

function Reg() {
  const [regData, setRegData] = useState({})

  const api = useIQmenuApi();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isValid, errors } = validateRegData(regData);

  const { mutate: registerUser, error: mutationError, isPending: isMutationPending } = useMutation({
    mutationFn: (data) => api.user.reg(data),
    mutationKey: ['api.user.reg'],
  })

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!isMutationPending) {
      if (!isValid) {
        alert("Форма заполнена с ошибками");
        return;
      }
      registerUser(regData, {
        onSuccess: (data) => {
          dispatch(setUserData(data))
          navigate('/o');
        }
      })
    }
  }

  useTitle({ general: "Регистрация" });

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
        <Typography variant='h6' sx={{ textAlign: "center" }}>РЕГИСТРАЦИЯ</Typography>
      </Stack>

      <form onSubmit={onSubmit}>
        <Stack spacing={2}>

          <FormControl fullWidth color='primary'>
            <TextField
              name="login"
              label="Телефон"
              variant="outlined"
              size='small'
              slotProps={{ inputLabel: { shrink: true }, input: { inputComponent: PhoneInputMask } }}
              required
              value={regData.phone}
              onChange={(event) => setRegData({ ...regData, phone: event.target.value })}
              error={errors.phone}
              helperText={errors.phone}
            />
          </FormControl>

          <FormControl fullWidth color='primary'>
            <TextField
              label="E-mail"
              size='small'
              required
              value={regData.email}
              onChange={(event) => setRegData({ ...regData, email: event.target.value })}
              error={errors.email}
              helperText={errors.email}
            />
          </FormControl>

          <FormControl fullWidth color='primary'>
            <TextField
              label="Как к вам обращаться?"
              size='small'
              required
              value={regData.name}
              onChange={(event) => setRegData({ ...regData, name: event.target.value })}
              error={errors.name}
              helperText={errors.name}
            />
          </FormControl>

          <FormControl fullWidth color='primary'>
            <PasswordInput 
              name="password"
              label="Пароль"
              size='small'
              required
              value={regData.password}
              onChange={(event) => setRegData({ ...regData, password: event.target.value })}
              error={errors.password}
              helperText={errors.password}
            />
          </FormControl>

          <FormControl fullWidth color='primary'>
            <PasswordInput 
              label="Повторите пароль"
              size='small'
              required
              value={regData.passwordRepeat}
              onChange={(event) => setRegData({ ...regData, passwordRepeat: event.target.value })}
              error={errors.passwordRepeat}
              helperText={errors.passwordRepeat}
            />
          </FormControl>

          <FormControl>
            <Button
              variant='contained'
              color='primary'
              type='submit'
              loading={isMutationPending}>
              Зарегистрироваться
            </Button>
          </FormControl>

        </Stack>
      </form>
      
      <Button
        variant='text'
        color='secondary'
        onClick={() => navigate("/auth")}
        sx={{ mt: 1 }}>
        Войти в аккаунт
      </Button>

      {mutationError && <Alert severity="error" sx={{ mt: 1 }}>{mutationError.message}</Alert>}

    </Stack>
  )
}

export default Reg