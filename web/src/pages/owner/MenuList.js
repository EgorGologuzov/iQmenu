import React from 'react'
import useIQmenuApi from '../../hooks/useIQmenuApi'
import EditIcon from '@mui/icons-material/Edit';
import QrCodeIcon from '@mui/icons-material/QrCode';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Card, Grid, CardMedia, CardContent, Typography, IconButton, CardActions, Stack, Button, CircularProgress, Box, Avatar } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import withStackContainerShell from '../../hoc/withStackContainerShell'
import useTitle from '../../hooks/useTitle'
import FastfoodIcon from '@mui/icons-material/Fastfood';

function MenuList() {
  const api = useIQmenuApi()
  const userId = useSelector(state => state.user.id)
  const navigate = useNavigate();

  const { data: menus, isLoading } = useQuery({
    queryKey: ["MenuList/getUsersMenus"],
    queryFn: () => api.menu.getUsersMenus(userId),
  })

  useTitle({ general: "Ваши меню" })

  if (isLoading) {
    return <CircularProgress />
  }

  return (
    <>
      <Button variant='outlined' startIcon={<AddCircleIcon />} onClick={() => navigate('/o/menu/new')} sx={{ width: "100%", maxWidth: "sm" }}>
        Создать меню
      </Button>

      <Grid container width={'100%'} spacing={1}>
        {menus.map(menu =>
          <Grid size={{ xs: 6, sm: 4, md: 3 }} key={menu.id}>
            <Card sx={{ maxWidth: '100%', maxHeight: 'min-content', textAlign: 'center' }}>

              <Box sx={{ width: "100%", aspectRatio: "1 / 1" }}>
                <Avatar
                  variant="square"
                  src={menu.image}
                  sx={{ width: "100%", height: "100%" }}
                >
                  <FastfoodIcon sx={{ width: 80, height: 80 }} />
                </Avatar>
              </Box>

              <CardContent sx={{ p: 1 }}>
                <Typography variant="subtitle2" component="div" noWrap>
                  {menu.menuName}
                </Typography>
                <Typography variant="subtitle2" noWrap sx={{ color: 'text.secondary' }}>
                  {menu.companyName}
                </Typography>
              </CardContent>

              <CardActions disableSpacing sx={{ placeContent: 'space-around', p: 0 }}>
                <IconButton aria-label="add to favorites" size='large' onClick={() => navigate(`/o/menu/${menu.id}/edit`)}>
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
    </>
  )
}

export default withStackContainerShell(MenuList)