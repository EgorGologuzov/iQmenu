import React from 'react'
import useTitle from '../../hooks/useTitle';
import { Box, Card, Chip, CardMedia, Divider, Button, Stack, SvgIcon, Typography, CardContent, Container, Grid, List, ListItem, ListItemText } from '@mui/material';
import Logo from '../../components/icons/LogoCustomizable';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

function TechStackCard({tech,desc,image}){
  return(
  <>
    <Card sx={{ maxWidth: 150, maxHeight: 'min-content', textAlign:'center', minInlineSize:'-webkit-fill-available'}}>
          <CardMedia
          component="img"
          alt="MONGO DB"
          height='100px'
          sx={{objectFit:'contain'}}
          image={image}
          />
          <CardContent alignContent='center' sx={{padding:"0", paddingX:'5px'}}>
            <Typography variant="h6" component="div">
            {tech}
            </Typography>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
              {desc}
            </Typography>
          </CardContent>
        </Card>
  </>)
}

function Presentation() {

  useTitle({ tabTitle: "iQmenu: QR-код меню для кафе и ресторанов", headerTitle: "Главная" }, [])

  return (
    <Stack alignItems={'center'}>
      <Typography variant='h1'>iQmenu</Typography>
      <Typography variant='overline'>Сервис по созданию электронных QR-код меню для кафе и ресторанов.</Typography>
      <Stack direction='row' alignContent='center' spacing={1}>
        <Chip clickable label='Функции' component='a' href='#functions' color='primary'/>
        <Chip clickable label="Стек технологий" color='primary' component='a' href='#techstack'/>
      </Stack>

      <Stack direction={'row'} spacing={2} alignItems={'center'} marginY={1}>
          <Typography width={'minContent'} variant='subtitle2'>Нет аккаунта и хотите создавать свои меню?</Typography>
          <ArrowForwardIosIcon color='primary' sx={{
          "@keyframes slideInFromRight": {
              "0%": {
                opacity: 1,
                transform: "translateX(0px)",
                      },
            "100%": {
                opacity: 0.75,
                transform: "translateX(5px)",
                      },
                    },
          animation: "slideInFromRight 0.6s ease-in alternate infinite",
                  }}/>
          <Button variant='outlined' color='secondary' size='small' href='/reg'> Зарегистрироваться </Button>
      </Stack>

      <SvgIcon inheritViewBox sx={{backgroundColor:'#222222',height:'450px', width: '100%', paddingY:'5px',marginTop:'10px'}}><Logo/></SvgIcon>

      <Box id='functions' sx={{width:{xs:"100%",sm:"600px", md:'800px'}, marginTop:'110px'}}>
        <Typography variant='h4'>Функции</Typography>
        <Typography variant='body2'>Сервис позволяет вледельцам кафе и ресторанов легко создавать электронное меню и размещать его на нашем сайте. Доступ к меню получить по сгенерированному QR-коду, который можно распечатать и разместить в заведении.</Typography>
        <Typography variant='body2'>Сервис расчитан на 2 категории пользователей: посетители и владельцы.</Typography>
        <br></br>
        <Typography variant='h5'>Посетители</Typography>
        <Typography variant='caption' color='red'>Посетители кафе и ресторанов.</Typography>
        <Typography variant='body2' paddingY='5px'>Посетители могут:</Typography>
        <List sx = {{ listStyleType : 'disc', padding:'0', marginLeft:2}}>
          <ListItem disablePadding sx = {{ display: 'list-item' }}> 
            <ListItemText primary="Просматривать опубликованные меню"/>
          </ListItem>
          <ListItem disablePadding sx = {{ display: 'list-item' }}> 
            <ListItemText primary="Добавлять позиции меню в список избранного"/>
          </ListItem>
        </List>
        <br></br>
        <Typography variant='h5'>Владельцы</Typography>
        <Typography variant='caption' color='green'>Владельцы кафе и ресторанов.</Typography>
        <Typography variant='body2' paddingY='5px'>Владельцы могут:</Typography>
        <List sx = {{ listStyleType : 'disc', padding:'0', marginLeft:2}}>
          <ListItem disablePadding sx = {{ display: 'list-item' }}> 
            <ListItemText primary={<p><a href='/reg'>Регистрироваться</a> и <a href='/auth'>авторизоваться</a> в приложении</p>}/>
          </ListItem>
          <ListItem disablePadding sx = {{ display: 'list-item' }}> 
            <ListItemText primary="Создавать / Обновлять / Удалять электронные меню"/>
          </ListItem>
          <ListItem disablePadding sx = {{ display: 'list-item' }}> 
            <ListItemText primary="Генерировать QR-код для доступа к своим меню"/>
          </ListItem>
        </List>
      </Box>

      <br></br>

      <Box id='techstack' sx={{width:{xs:"100%",md:'800px'}}}>
        <Typography variant='h4'>Стек технологий</Typography>
        <Typography variant='body1'>MERN: MongoDB + Express JS + React JS (+ Material UI) + Node JS.</Typography>
        <br></br>
        <Grid container spacing={2} columns={2} height={'maxContent'} marginBottom={5}>
          <TechStackCard image={process.env.PUBLIC_URL + "/mongodb_thumbnail.png"} tech={'Mongo DB'} desc={'База данных'}/>
          <TechStackCard image={process.env.PUBLIC_URL + "/React_Logo_SVG.svg.png"} tech={'React'} desc={'веб-интерфейс на основе Material UI.'}/>
          <TechStackCard image={process.env.PUBLIC_URL + "/express-js.png"} tech={'Express JS'} desc={'REST API'}/>
          <TechStackCard image={process.env.PUBLIC_URL + "/images (1).png"} tech={'Node JS'} desc={'Сервер'}/>
        </Grid>
      </Box>
    </Stack>
  )
}

export default Presentation