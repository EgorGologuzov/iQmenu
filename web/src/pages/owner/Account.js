import { Avatar, Grid, Icon, Typography, IconButton, FormControl, TextField, Stack, Button } from '@mui/material'
import { styled } from '@mui/material/styles';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import useIQmenuApi from '../../hooks/useIQmenuApi';
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { setUserData } from '../../store/slices/userSlice';
import withStackContainerShell from '../../hoc/withStackContainerShell';

function Account() {
  const { name, avatar, email } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const api = useIQmenuApi();

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    reset,
    watch,
    formState: { errors, isDirty }
  } = useForm({ defaultValues: { name, avatar, email }, mode: 'onChange' });

  const { mutate: updateUser } = useMutation({
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
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

        <Button variant='contained' disabled={!isDirty} type='submit'>Применить</Button>
        <Button variant='outlined' disabled={!isDirty} onClick={() => reset()}>Отменить изменения</Button>

      </Stack>
    </form>
  )
}

export default withStackContainerShell(Account)