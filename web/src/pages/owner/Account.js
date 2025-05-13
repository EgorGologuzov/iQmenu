import { Avatar, IconButton, FormControl, TextField, Stack, Button, FormHelperText, Alert } from '@mui/material'
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { styled } from '@mui/material/styles';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import useIQmenuApi from '../../hooks/useIQmenuApi';
import { useForm, Controller } from 'react-hook-form'
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

  const user = useSelector(state => state.user)
  const dispatch = useDispatch();
  const api = useIQmenuApi();
  const navigate = useNavigate();

  const [avatar, setAvatar] = useState(user.avatar);

  useTitle({ general: 'Ваш профиль' }, [])

  const {
    register,
    handleSubmit,
    getValues,
    control,
    watch,
    setValue,
  } = useForm({ defaultValues: user, mode: 'onChange', criteriaMode: 'all' });

  const buildedUser = { ...user, ...watch(), avatar: avatar };
  const updateData = { ...getValues(), avatar: avatar };
  const hasChanges = !compareUser(buildedUser, user);
  const { errors, isValid } = validateUserUpdate(updateData);

  const saveUser = user => {
    dispatch(setUserData(user));
    setAvatar(user.avatar);
    setValue("password", "");
    setValue("passwordRepeat", "");
  }

  const { mutate: updateUser, isPending: isMutationPending, error: mutationError } = useMutation({
    mutationFn: (data) => api.user.update(data),
    mutationKey: ['api.user.update'],
    onSuccess: (user) => { saveUser(user) },
  })

  const onSubmit = async () => {
    updateUser(processUser(updateData));
  }

  useUnsavedChangesWarning(!hasChanges);

  const onLeave = async () => {
    await navigate('/auth');
    setTimeout(() => dispatch(clearUserData()), 1500);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%", justifyItems: 'center' }}>
      <Stack direction="column" spacing={2} sx={{ width: "100%", maxWidth: "sm" }}>

        <SaveStatus isSaved={!hasChanges} />

        <FormControl
          fullWidth
          color='primary'>
          <TextField id="name" size='small' label="ФИО"
            {...register('name')}
            error={errors.name}
            helperText={errors.name}
          />
        </FormControl>

        <FormControl
          fullWidth
          color='primary'
        >
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Телефон"
                variant="outlined"
                size='small'
                slotProps={{ inputLabel: { shrink: true }, input: { inputComponent: PhoneInputMask } }}
                error={errors.phone}
                helperText={errors.phone}
              />
            )}
          />
        </FormControl>

        <FormControl
          fullWidth
          color='primary'>
          <TextField id="email" label="Email" size='small'
            {...register('email')}
            error={errors.email}
            helperText={errors.email}
          />
        </FormControl>

        <FormControl
          fullWidth
          color='primary'
          error={errors.password}
        >
          <PasswordInput id="password" label="Пароль" size='small'
            {...register('password')}
          />
          {errors.password && <FormHelperText>{errors.password}</FormHelperText>}
        </FormControl>

        <FormControl
          fullWidth
          color='primary'
          error={errors.passwordRepeat}
        >
          <PasswordInput id="passwordRepeat" label="Повторите пароль" size='small'
            {...register('passwordRepeat')}
          />
          {errors.passwordRepeat && <FormHelperText>{errors.passwordRepeat}</FormHelperText>}
        </FormControl>

        <ImageInput
          image={avatar}
          onChange={setAvatar}
          label="Аватар"
        />

        <SaveStatus isSaved={!hasChanges} />

        {mutationError && <Alert severity="error">{mutationError.message}</Alert>}

        <Button variant='contained' disabled={!hasChanges || isMutationPending || !isValid} loading={isMutationPending} type='submit'>Сохрнаить изменения</Button>
        <Button variant='outlined' disabled={isMutationPending} onClick={() => navigate(-1)}>Назад</Button>

        <Button disabled={isMutationPending} startIcon={<ExitToAppIcon />} color='error' variant='contained' onClick={() => (onLeave())}>
          Выйти из аккаунта
        </Button>

      </Stack>
    </form>
  )
}

export default withStackContainerShell(Account)