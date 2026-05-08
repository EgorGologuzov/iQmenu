import React, { useState } from 'react'
import useIQmenuApi from '../../hooks/useIQmenuApi'
import EditIcon from '@mui/icons-material/Edit';
import QrCodeIcon from '@mui/icons-material/QrCode';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import { Card, Grid, CardContent, Typography, IconButton, CardActions, Stack, Button, CircularProgress, Box, Avatar, Alert } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router'
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
    return <CircularProgress disableShrink sx={{ alignSelf: 'center' }} />
  }

  const showQrDialog = (menuQr) => {
    setIsDialogOpen(true)
    setCurrentQrCode(menuQr)
  }

  const hideQrDialog = () => {
    setIsDialogOpen(false)
    setCurrentQrCode(null)
  }

  const navigateMenuEdit = (menuId) => {
    navigate(`/o/menu/${menuId}/edit`)
  }

  const navigateMenuCreate = () => {
    navigate('/o/menu/new')
  }

  return (
    <>
      {(!menus || !menus.length) &&
        <Alert severity="info">Вы еще не создали ни одного меню. Создайте сейчас!</Alert>
      }

      <Grid container width={'100%'} spacing={1}>

        <Grid size={{ xs: 6, md: 4 }}>
          <Card sx={{
              maxWidth: '100%',
              textAlign: 'center',
              border: '2px solid transparent',
              '&:hover': {
                borderColor: 'primary.main',
                boxShadow: 3,
              },
            }}>
            <Box sx={{ width: "100%", aspectRatio: "1 / 1" }}>
              <Avatar
                variant="square"
                onClick={navigateMenuCreate}
                sx={{ width: "100%", height: "100%", cursor: "pointer" }}>
                <AddCircleIcon sx={{ width: 80, height: 80 }} />
              </Avatar>
            </Box>
            <Stack
              direction="column"
              sx={{ p: 1, cursor: "pointer", height: "108px", justifyContent: 'center' }}
              onClick={navigateMenuCreate}>
              <Typography variant="subtitle2" component="div" noWrap>
                Создать новое меню
              </Typography>
            </Stack>
          </Card>
        </Grid>

        {menus && menus.length != 0 && menus.map(menu =>
          <Grid size={{ xs: 6, md: 4 }} key={menu.id}>
            <Card sx={{
                maxWidth: '100%',
                maxHeight: 'min-content',
                textAlign: 'center',
                border: '2px solid transparent',
                '&:hover': {
                  borderColor: 'primary.main',
                  boxShadow: 3,
                },
              }}>
              <Box sx={{ width: "100%", aspectRatio: "1 / 1" }}>
                <Avatar
                  variant="square"
                  src={joinWithApiBaseUrl(menu.image)}
                  onClick={() => navigateMenuEdit(menu.id)}
                  sx={{ width: "100%", height: "100%", cursor: "pointer" }}>
                  <FastfoodIcon sx={{ width: 80, height: 80 }} />
                </Avatar>
              </Box>

              <CardContent sx={{ p: 1, cursor: "pointer" }} onClick={() => navigateMenuEdit(menu.id)}>
                <Typography variant="subtitle2" component="div" noWrap>
                  {menu.menuName}
                </Typography>
                <Typography variant="subtitle2" noWrap sx={{ color: 'text.secondary' }}>
                  {menu.companyName}
                </Typography>
              </CardContent>

              <CardActions disableSpacing sx={{ placeContent: 'space-around', p: 0 }}>
                <Link to={`/${menu.id}`} target="_blank">
                  <IconButton aria-label="share" size='large'>
                    <OndemandVideoIcon />
                  </IconButton>
                </Link>
                <IconButton aria-label="share" size='large' onClick={() => showQrDialog(menu.qr)}>
                  <QrCodeIcon />
                </IconButton>
              </CardActions>

            </Card>
          </Grid>
        )}

      </Grid>

      <MenuQrCodeDialog qr={currentQrCode} open={isDialogOpen} onClose={() => hideQrDialog()} />
    </>
  )
}

export default withStackContainerShell(MenuList)