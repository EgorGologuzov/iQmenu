import React from 'react'
import {
  FormControl,
  Alert,
  Stack,
  Typography,
  IconButton,
  Button,
  TextField,
  FormHelperText
} from '@mui/material';
import Logo from '../../components/icons/Logo';
import PasswordInput from '../../components/inputs/PasswordInput';
import { useNavigate } from 'react-router';
import useIQmenuApi from '../../hooks/useIQmenuApi';
import { useMutation } from '@tanstack/react-query'
import { useForm, Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { setUserData } from '../../store/slices/userSlice';
import { IMaskInput } from 'react-imask'

function Reg() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const api=useIQmenuApi(); 
  const {
    register,
    handleSubmit,
    getValues,
    control,
    watch,
    formState:{errors}
  } = useForm({mode:'onChange',criteriaMode:'all'});

  const { mutate: registerUser, error: mutationError, isPending: isMutationPending }=useMutation({
    mutationFn: (data)=>api.user.reg(data),
    mutationKey: ['Reg'],
  })

  const onSubmit = async () => {
    registerUser(getValues(),{onSuccess: (data)=> 
        {
          dispatch(setUserData(data))
          navigate('/o');
        }
      })
  }

  const PHONE_MASK = "+{7}(000)00-00-00";
  function PhoneInputMask(props) {
    const { inputRef, onChange, ...other } = props;
    return (
      <IMaskInput
        {...other}
        mask={PHONE_MASK}
        inputRef={inputRef}
        onAccept={(value) => onChange({ target: { value } })}
        overwrite
      />
    );
  }

  return (
    <Stack spacing={2} width={'100%'} maxWidth="sm" borderRadius={'10px 10px 5px 5px'} bgcolor={'white'} padding={'10px'} boxShadow={'0 30px 40px rgba(0,0,0,.2)'}>
      <Stack bgcolor="#444444" alignContent={'center'} alignItems={'center'} borderRadius={'10px 10px 0px 0px'}>
        <IconButton size="large" edge="start" sx={{ p: 0, flexDirection: 'end', bgcolor: "#444444", marginTop: '5px', boxShadow: '-1px 4px 8px 5px rgb(0 0 0 / 33%);' }} href="/">
          <Logo />
        </IconButton>
        <Typography variant='h5' paddingBottom={'5px'} sx={{ textShadow: '-1px 4px black' }} align='center' color='primary.contrastText'>Регистрация</Typography>
      </Stack>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <FormControl
            fullWidth
            color='primary'
            >
            {/* <TextField id="phone" label="Телефон" size='small' required
            error={errors.phone && errors.phone.type === 'pattern'}
            helperText={errors.phone && errors.phone.type === 'pattern' && errors.phone.message}
            {...register('phone',{pattern:{
              value: /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/,
              message: 'Введите российский номер.'
            }})}/> */}
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
                  placeholder="+7(___)___-__-__"
                />
              )}
            />
          </FormControl>

          

          <FormControl
            fullWidth
            color='primary'>
            <TextField id="email" label="E-mail" size='small' required error={errors.email && errors.email.type === 'pattern'}
            helperText={errors.email && errors.email.type === 'pattern' && errors.email.message}
            {...register('email',{required:true, pattern: {
              value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: 'Неправильный адрес электронной почты.',
            }})}/>
          </FormControl>

          <FormControl
            fullWidth
            color='primary'>
            <TextField id="username" label="Имя" helperText="Как к вам обращаться?" size='small' required
            {...register('username')}/>
          </FormControl>

          <FormControl
            fullWidth
            color='primary' required
            error={errors.passwordRepeat}>
            <PasswordInput id="password" label="Пароль" size='small'
            {...register('password',{deps:'passwordRepeat'})}/>
          </FormControl>

          <FormControl
            fullWidth
            color='primary' required
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

          <FormControl>
            <Button variant='contained' color='primary' type='submit' loading={isMutationPending}>
              Зарегистрироваться
            </Button>
          </FormControl>
        </Stack>
      </form>
      {mutationError&&<Alert severity="error">{mutationError.message}</Alert>}
      <Button variant='text'color='secondary' onClick={() => navigate("/auth")}>
        Войти в аккаунт
      </Button>
    </Stack>
  )
}

export default Reg