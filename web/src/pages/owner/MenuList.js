import React, { useState } from 'react'
import useIQmenuApi from '../../hooks/useIQmenuApi'
import EditIcon from '@mui/icons-material/Edit';
import QrCodeIcon from '@mui/icons-material/QrCode';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Card, Grid, CardContent, Typography, IconButton, CardActions, Stack, Button, CircularProgress, Box, Avatar, Alert } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import withStackContainerShell from '../../hoc/withStackContainerShell'
import useTitle from '../../hooks/useTitle'
import FastfoodIcon from '@mui/icons-material/Fastfood';
import MenuQrCodeDialog from '../../components/dialogs/MenuQrCodeDialog';
import { joinWithApiBaseUrl } from '../../utils/utils';

function MenuList() {
  const api = useIQmenuApi()
  const userId = useSelector(state => state.user.id)
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentQrCode, setCurrentQrCode] = useState(null);

  const { data: menus, isLoading } = useQuery({
    queryKey: ["MenuList/getUsersMenus"],
    queryFn: () => api.menu.getUsersMenus(userId),
    refetchOnWindowFocus: false,
  })

  useTitle({ general: "Ваши меню" }, []);

  if (isLoading) {
    return <CircularProgress />
  }

  const showQrDialog = (menuQr) => {
    setIsDialogOpen(true)
    setCurrentQrCode(menuQr)
  }

  const hideQrDialog = () => {
    setIsDialogOpen(false)
    setCurrentQrCode(null)
  }

  return (
    <>
      <Button variant='outlined' startIcon={<AddCircleIcon />} onClick={() => navigate('/o/menu/new')} sx={{ width: "100%", maxWidth: "sm" }}>
        Создать меню
      </Button>

      {(!menus || !menus.length) &&
        <Alert severity="info">Вы еще не создали ни одного меню. Создайте сейчас!</Alert>
      }

      {menus && menus.length != 0 && (
        <Grid container width={'100%'} spacing={1}>
          {menus.map(menu =>
            <Grid size={{ xs: 6, sm: 4, md: 3 }} key={menu.id}>
              <Card sx={{ maxWidth: '100%', maxHeight: 'min-content', textAlign: 'center' }}>

                <Box sx={{ width: "100%", aspectRatio: "1 / 1" }}>
                  <Avatar
                    variant="square"
                    src={joinWithApiBaseUrl(menu.image)}
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
                  <IconButton aria-label="share" size='large' onClick={() => showQrDialog(menu.qr)}>
                    <QrCodeIcon />
                  </IconButton>
                </CardActions>

              </Card>
            </Grid>
          )}
        </Grid>
      )}

      <MenuQrCodeDialog qr={currentQrCode} open={isDialogOpen} onClose={() => hideQrDialog()} />
    </>
  )
}

export default withStackContainerShell(MenuList)