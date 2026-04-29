import { FormControl, TextField, Stack, Button, FormHelperText, Alert, Divider, ButtonGroup, Tooltip } from '@mui/material'
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import useIQmenuApi from '../../hooks/useIQmenuApi';
import { useMutation } from '@tanstack/react-query'
import { setUserData, clearUserData } from '../../store/slices/userSlice';
import withStackContainerShell from '../../hoc/withStackContainerShell';
import PasswordInput from '../../components/inputs/PasswordInput';
import PhoneInputMask from '../../components/inputs/PhoneInputMask';
import useTitle from '../../hooks/useTitle';
import useUnsavedChangesWarning from '../../hooks/useUnsavedChangesWarning';
import { useNavigate } from 'react-router';
import SaveStatus from '../../components/utils/SaveStatus';
import { compareUser } from '../../data/models/comparation';
import ImageInput from '../../components/inputs/ImageInput';
import { processUser } from '../../data/models/processing';
import { validateUserUpdate } from '../../data/models/validation'

function Account() {

  const savedUser = useSelector(state => state.user);
  const [user, setUser] = useState(savedUser);

  const api = useIQmenuApi();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const hasChanges = !compareUser(user, savedUser);
  const { errors, isValid } = validateUserUpdate(user);

  const navigateWithBlocker = useUnsavedChangesWarning(!hasChanges);

  const saveUser = user => {
    dispatch(setUserData(user));
    setUser({ ...user, password: "", passwordRepeat: "" });
  }

  const { mutate: updateUser, isPending: isMutationPending, error: mutationError } = useMutation({
    mutationFn: (data) => api.user.update(data),
    mutationKey: ['api.user.update'],
    onSuccess: (user) => { saveUser(user) },
  })

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!isMutationPending) {
      updateUser(processUser(user));
    }
  }

  useTitle({ general: 'Ваш профиль' }, [])

  const onLeave = () => {
    if (window.confirm("Вы уверены, что хотите выйти из аккаунта?")) {
      navigateWithBlocker('/auth', {
        replace: true,
        onNavigate: () => setTimeout(() => dispatch(clearUserData()), 1000),
      });
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ width: "100%", justifyItems: 'center' }}>
      <Stack 
        direction="column" 
        spacing={2} 
        sx={{ width: '100%', minWidth: { xs: '100%', sm: '600px' }, maxWidth: 'sm' }}>

        <ButtonGroup sx={{ width: "100%" }}>
          <Tooltip title="Назад">
            <Button
              variant='outlined'
              disabled={isMutationPending}
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
              sx={{ flexGrow: 1 }}
            />
          </Tooltip>
          <Tooltip title="Сохранить изменения">
            <Button
              variant='contained'
              disabled={!hasChanges || isMutationPending || !isValid}
              startIcon={<CheckRoundedIcon />}
              loading={isMutationPending}
              type='submit'
              sx={{ flexGrow: 1 }}
            />
          </Tooltip>
        </ButtonGroup>

        <SaveStatus isSaved={!hasChanges} />

        <Divider />

        <FormControl
          fullWidth
          color='primary'>
          <TextField 
            label="Как к вам обращаться?"
            size='small'
            required
            value={user.name}
            onChange={(event) => setUser({ ...user, name: event.target.value })}
            error={errors.name}
            helperText={errors.name}
          />
        </FormControl>

        <FormControl
          fullWidth
          color='primary'>
          <TextField
            name="login"
            label="Телефон"
            size='small'
            slotProps={{ inputLabel: { shrink: true }, input: { inputComponent: PhoneInputMask } }}
            required
            value={user.phone}
            onChange={(event) => setUser({ ...user, phone: event.target.value })}
            error={errors.phone}
            helperText={errors.phone}
          />
        </FormControl>

        <FormControl
          fullWidth
          color='primary'>
          <TextField 
            label="E-mail"
            size='small'
            required
            value={user.email}
            onChange={(event) => setUser({ ...user, email: event.target.value })}
            error={errors.email}
            helperText={errors.email}
          />
        </FormControl>

        <FormControl
          fullWidth
          color='primary'>
          <PasswordInput
            name="password"
            label="Пароль"
            size='small'
            value={user.password}
            onChange={(event) => setUser({ ...user, password: event.target.value })}
            error={errors.password}
            helperText={errors.password}
          />
        </FormControl>

        <FormControl
          fullWidth
          color='primary'>
          <PasswordInput
            label="Повторите пароль"
            size='small'
            value={user.passwordRepeat}
            onChange={(event) => setUser({ ...user, passwordRepeat: event.target.value })}
            error={errors.passwordRepeat}
            helperText={errors.passwordRepeat}
          />
        </FormControl>

        <ImageInput
          image={user.avatar}
          label="Аватар"
          onChange={(avatar) => setUser({ ...user, avatar: avatar })}
          error={errors.avatar}
          helperText={errors.avatar}
        />

        <Divider />

        <SaveStatus isSaved={!hasChanges} />

        {mutationError && <Alert severity="error">{mutationError.message}</Alert>}

        <Button
          disabled={isMutationPending}
          startIcon={<ExitToAppIcon />}
          color='error'
          variant='contained'
          onClick={() => (onLeave())}>
          Выйти из аккаунта
        </Button>

      </Stack>
    </form>
  )
}

export default withStackContainerShell(Account)