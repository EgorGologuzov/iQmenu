import React, { memo, useCallback, useState } from 'react'
import useIQmenuApi from '../../hooks/useIQmenuApi'
import EditIcon from '@mui/icons-material/Edit';
import QrCodeIcon from '@mui/icons-material/QrCode';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import { Card, Grid, CardContent, Typography, IconButton, CardActions, Stack, Button, CircularProgress, Box, Avatar, Alert, ButtonGroup, Tooltip } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router'
import withStackContainerShell from '../../hoc/withStackContainerShell'
import useTitle from '../../hooks/useTitle'
import FastfoodIcon from '@mui/icons-material/Fastfood';
import MenuQrCodeDialog from '../../components/dialogs/MenuQrCodeDialog';
import { joinWithApiBaseUrl } from '../../utils/utils';
import OwnerNavBar from '../../components/navs/OwnerNavBar';
import DownloadStatisticDialog from '../../components/dialogs/DownloadStatisticDialog';

const MenuCard = memo(({ menu, onQrButtonClick, onStatisticButtonClick }) => {

  const navigate = useNavigate();

  const navigateMenuEdit = (menuId) => {
    navigate(`/o/menu/${menuId}/edit`)
  }

  return (
    <Grid size={{ xs: 6, md: 4 }}>
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
          <IconButton aria-label="share" size='large' onClick={() => onQrButtonClick(menu)}>
            <QrCodeIcon />
          </IconButton>
          <IconButton aria-label="share" size='large' onClick={() => onStatisticButtonClick(menu)}>
            <AutoGraphIcon />
          </IconButton>
        </CardActions>

      </Card>
    </Grid>
  )
})

function MenuList() {

  const api = useIQmenuApi()
  const userId = useSelector(state => state.user.id)
  const navigate = useNavigate();
  const [isQrDialogOpen, setIsQrDialogOpen] = useState(false);
  const [isStatisticDialogOpen, setIsStatisticDialogOpen] = useState(false);
  const [currentMenu, setCurrentMenu] = useState();

  const { data: menus, isLoading, error } = useQuery({
    queryKey: [`api.menu.getUsersMenus`, userId],
    queryFn: () => api.menu.getUsersMenus(userId),
    refetchOnWindowFocus: false,
  })

  const showQrDialog = useCallback((menu) => {
    setCurrentMenu(menu);
    setIsQrDialogOpen(true);
  }, []);

  const showStatDialog = useCallback((menu) => {
    setCurrentMenu(menu);
    setIsStatisticDialogOpen(true);
  }, []);

  const navigateMenuCreate = () => {
    navigate('/o/menu/new')
  }

  useTitle({ general: "Ваши меню" }, []);

  if (isLoading) {
    return <>
      <OwnerNavBar />
      <CircularProgress disableShrink sx={{ alignSelf: 'center' }} />
    </>
  }

  return (
    <>
      <OwnerNavBar />

      {(!menus || !menus.length) &&
        <Alert severity="info">Вы еще не создали ни одного меню. Создайте сейчас!</Alert>
      }

      {error && !isLoading && <Alert severity="error">{error.message}</Alert>}

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
                Создать <br /> новое меню
              </Typography>
            </Stack>
          </Card>
        </Grid>

        {menus && menus.length != 0 && menus.map(menu =>
          <MenuCard
            key={menu.id}
            menu={menu}
            onQrButtonClick={showQrDialog}
            onStatisticButtonClick={showStatDialog}
          />
        )}

      </Grid>

      {isQrDialogOpen && <MenuQrCodeDialog
        qr={currentMenu.qr}
        open={isQrDialogOpen}
        onClose={() => setIsQrDialogOpen(false)}
      />}

      {isStatisticDialogOpen && <DownloadStatisticDialog
        menu={currentMenu}
        open={isStatisticDialogOpen}
        onClose={() => setIsStatisticDialogOpen(false)}
      />}
    </>
  )
}

export default withStackContainerShell(MenuList)