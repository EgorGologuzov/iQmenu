import React from 'react'
import useIQmenuApi from '../../hooks/useIQmenuApi'
import MENU_1 from '../../data/static/json/menu-1.json'
import MENU_2 from '../../data/static/json/menu-2.json'
import MENU_3 from '../../data/static/json/menu-3.json'
import EditIcon from '@mui/icons-material/Edit';
import QrCodeIcon from '@mui/icons-material/QrCode';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Card, Grid, CardMedia, CardContent, Typography, IconButton, CardActions, Stack, Button, CircularProgress } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'

function MenuList() {
  const api=useIQmenuApi()
  const userId=useSelector(state=>state.user.id)
  const navigate = useNavigate();
  const {data: menus, isLoading} = useQuery({
    queryKey: ["MenuList/getUsersMenus"],
    queryFn: () => api.menu.getUsersMenus(userId),
  })

  if (isLoading){
    return <CircularProgress sx={{display:'flex',placeSelf:'center', marginTop:2}}/>
  }

  return (
    <Stack maxWidth={'md'} justifySelf={'center'}  marginTop={4} spacing={1}  padding={'5px'}>
      <Button variant='outlined' startIcon={<AddCircleIcon/>} onClick={()=>navigate('/o/menu/new')}>Создать меню</Button>
      <Grid container width={'100%'} spacing={2}>
        {menus.map(menu=>
          <Grid size={{ xs: 6, sm: 4}} key={menu.id}>
            <Card sx={{maxWidth:'100%', maxHeight: 'min-content', textAlign: 'center', p:1}}>

              <CardMedia
                  component="img"
                  alt="MONGO DB"
                  image='https://assets.turbologo.ru/blog/ru/2020/01/18163037/qr-kod.png'
                  sx={{ objectFit: 'contain' }}
              />

              <CardContent alignContent='center'>
                <Typography variant="h6" component="div">
                  {menu.menuName}
                </Typography>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  {menu.companyName}
                </Typography>
              </CardContent>

              <CardActions disableSpacing sx={{placeContent:'space-around', p:0}}>
                <IconButton aria-label="add to favorites" size='large' onClick={()=>navigate(`/o/menu/${menu.id}/edit`)}>
                  <EditIcon />
                </IconButton>
                <IconButton aria-label="share" size='large'>
                  <QrCodeIcon />
                </IconButton>
              </CardActions>

            </Card>
          </Grid>
        )}
      </Grid>
    </Stack>
  )
}

export default MenuList