import { Avatar, Grid, Icon, Typography, IconButton, FormControl, TextField, Stack, Button, FormHelperText, Alert } from '@mui/material'
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react'
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

function Account() {
  const { name, avatar, email, phone } = useSelector(state => state.user);
  const user=useSelector(state=>state.user)
  const dispatch = useDispatch();
  const api = useIQmenuApi();
  const navigate = useNavigate();

  useTitle({general: 'Ваш профиль'})

  useEffect(()=>{
    reset()
  },[])

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    control,
    reset,
    watch,
    formState: { errors, isDirty, dirtyFields }
  } = useForm({ defaultValues: { name, avatar, phone:phone, email, password:undefined }, mode: 'onChange' ,criteriaMode:'all'});

  const { mutate: updateUser, isPending: isMutationPending } = useMutation({
    mutationFn: (data) => api.user.update(data),
    mutationKey: ['Update'],
  })


  const onSubmit = async () => {
    updateUser(getValues(), {
      onSuccess: (data) => {
        console.log(data)
        dispatch(setUserData(data))
      }
    })
  }

  useUnsavedChangesWarning(!isDirty)

  const preview = watch('avatar')
  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  const onLeave=()=>{
    dispatch(clearUserData())
    navigate('/')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%", justifyItems:'center'}}>
      <Stack direction="column" spacing={2} sx={{ width: "100%", maxWidth: "sm" }}>

        <IconButton sx={{ width: '100%', aspectRatio: '1/1', maxWidth: '200px', alignSelf: 'center' }} component='label' tabIndex={-1}>
          <Avatar src={preview} sx={{ width: '100%', height: '100%' }} />
          <VisuallyHiddenInput
            type="file"
            accept="image/png, image/jpeg"
            {...register('avatar')}
            onChange={(e) => {
              setValue('avatar', URL.createObjectURL(e.target.files[0]), { shouldDirty: true })
            }}
          />
        </IconButton>

        <FormControl
          fullWidth
          color='primary'>
          <TextField id="name" size='small' label="ФИО"
            {...register('name')} />
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
                  slotProps={{inputLabel:{shrink:true}, input:{inputComponent:PhoneInputMask}}}
                  required
                />
              )}
            />
          </FormControl>

        <FormControl
          fullWidth
          color='primary'>
          <TextField id="email" label="Email" size='small'
            error={errors.email && errors.email.type === 'pattern'}
            {...register('email', {
              required: true, pattern: {
                value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: 'Неправильный адрес электронной почты.',
              }
            })}
            helperText={errors.email && errors.email.type === 'pattern' && errors.email.message} />
        </FormControl>

        <FormControl
            fullWidth
            color='primary'
            error={errors.passwordRepeat}>
            <PasswordInput id="password" label="Пароль" size='small'
            {...register('password',{deps:'passwordRepeat'})}/>
          </FormControl>

          <FormControl
            fullWidth
            color='primary'
            error={errors.passwordRepeat}>
            <PasswordInput id="passwordRepeat" label="Повторите пароль" size='small'
            {...register('passwordRepeat',{validate:(value)=>{
              if (watch('password')!==value){
                return 'Пароли не совпадают'
              }
            },
            minLength:{
              value:8,
              message: 'Минимальная длина пароля: 8 символов'
            }})}
            />
              {errors.passwordRepeat && <FormHelperText>{errors.passwordRepeat.types.validate}</FormHelperText>}
              {errors.passwordRepeat && <FormHelperText>{errors.passwordRepeat.types.minLength}</FormHelperText>}
          </FormControl>
        <Button variant='contained' disabled={!isDirty} loading={isMutationPending} type='submit'>Применить</Button>
        <Button variant='outlined' disabled={!isDirty} onClick={() => reset()}>Отменить изменения</Button>

        {!isDirty
        ?<Alert severity="success">Изменения сохранены</Alert>
        :<Alert severity="warning">Не забудьте сохранить изменения</Alert>}

        <Button startIcon={<ExitToAppIcon/>} color='warning' variant='contained' onClick={()=>(onLeave())}>
          Выйти из аккаунта
        </Button>

        <Button onClick={()=>console.log(dirtyFields)}></Button>
      </Stack>
    </form>
  )
}

export default withStackContainerShell(Account)