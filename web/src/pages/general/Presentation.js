import React from 'react'
import useTitle from '../../hooks/useTitle';
import { Box, Card, Chip, CardMedia, Divider, Button, Stack, SvgIcon, Typography, CardContent, Container, Grid, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import Logo from '../../components/icons/LogoCustomizable';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import withStackContainerShell from '../../hoc/withStackContainerShell';
import { Link, useNavigate } from 'react-router';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CLink from '../../components/utils/CLink';

function TechStackCard({ tech, desc, image }) {
  return (
    <>
      <Card sx={{ maxWidth: 150, maxHeight: 'min-content', textAlign: 'center', minInlineSize: '-webkit-fill-available' }}>
        <CardMedia
          component="img"
          alt="MONGO DB"
          height='100px'
          sx={{ objectFit: 'contain' }}
          image={image}
        />
        <CardContent sx={{ padding: "0", paddingX: '5px', alignContent: 'center' }}>
          <Typography variant="h6" component="div">
            {tech}
          </Typography>
          <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
            {desc}
          </Typography>
        </CardContent>
      </Card>
    </>
  )
}

const Item = ({ primary }) => {
  return (
    <ListItem>
      <ListItemIcon color='secondary'>
        <CheckCircleIcon color='secondary' />
      </ListItemIcon>
      <ListItemText primary={primary} />
    </ListItem>
  )
}

function Presentation() {

  const navigate = useNavigate();

  useTitle({ tabTitle: "iQmenu: QR-код меню для кафе и ресторанов", headerTitle: "Главная" }, [])

  return (
    <Stack alignItems={'center'} textAlign={'center'} spacing={2}>

      <Stack spacing={2} sx={{ height: "calc(100vh - 144px)", textAlign: "center", alignItems: "center", justifyContent: "center" }}>
        <SvgIcon
          inheritViewBox
          sx={{ width: 150, height: 150, backgroundColor: "primary.main", borderRadius: "50%", borderWidth: "3px", borderColor: "primary.main", borderStyle: "solid" }}
        >
          <Logo />
        </SvgIcon>

        <Typography variant='h1'>iQmenu</Typography>
        <Typography variant='body1'>Сервис по созданию электронных QR-код меню для кафе и ресторанов.</Typography>

        <Typography variant='subtitle2'>Хотите создавать свои меню?</Typography>

        <Stack direction="column" spacing={1} width="100%" maxWidth="xs">
          <Button variant='contained' sx={{ width: "250" }} onClick={() => navigate("auth")}>Войдите</Button>
          <Typography variant='body1'>или</Typography>
          <Button variant='outlined' sx={{ width: "250" }} onClick={() => navigate("reg")}>Зарегистрируйтесь</Button>
        </Stack>
      </Stack>

      <Stack textAlign={'justify'} spacing={2} width="100%" maxWidth="sm">
        <Typography variant='h5' textAlign="center">Функции</Typography>

        <Typography variant='body1'>Сервис позволяет вледельцам кафе и ресторанов легко создавать электронное меню и размещать его на нашем сайте. Доступ к меню получить по сгенерированному QR-коду, который можно распечатать и разместить в заведении.</Typography>
        <Typography variant='body1'>Сервис расчитан на 2 категории пользователей: посетители и владельцы.</Typography>

        <Typography variant='h5' textAlign="center">Посетители</Typography>

        <Typography variant='body1'>Посетители кафе и ресторанов. Они могут:</Typography>

        <List>
          <Item primary="Просматривать опубликованные меню" />
          <Item primary="Добавлять позиции меню в список избранного" />
        </List>

        <Typography variant='h5' textAlign="center">Владельцы</Typography>

        <Typography variant='body1'>Владельцы кафе и ресторанов. Они могут:</Typography>

        <List>
          <Item primary={<><CLink to='/reg'>Регистрироваться</CLink> и <CLink to='/auth'>авторизоваться</CLink> в приложении</>} />
          <Item primary="Создавать / Обновлять / Удалять электронные меню" />
          <Item primary="Генерировать QR-код для доступа к своим меню" />
        </List>

        <Typography variant='h5' textAlign="center">Стек технологий</Typography>

        <Typography variant='body1'>MERN: MongoDB + Express JS + React JS (+ Material UI) + Node JS.</Typography>

        <Grid container spacing={2} columns={2} height={'maxContent'} marginBottom={5}>
          <TechStackCard image={process.env.PUBLIC_URL + "/mongodb_thumbnail.png"} tech={'Mongo DB'} desc={'База данных'} />
          <TechStackCard image={process.env.PUBLIC_URL + "/React_Logo_SVG.svg.png"} tech={'React'} desc={'веб-интерфейс на основе Material UI.'} />
          <TechStackCard image={process.env.PUBLIC_URL + "/express-js.png"} tech={'Express JS'} desc={'REST API'} />
          <TechStackCard image={process.env.PUBLIC_URL + "/images (1).png"} tech={'Node JS'} desc={'Сервер'} />
        </Grid>
      </Stack>



    </Stack>
  )
}

export default withStackContainerShell(Presentation)