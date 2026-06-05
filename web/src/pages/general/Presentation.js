import React, { useState, useEffect } from 'react';
import useTitle from '../../hooks/useTitle';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import Logo from '../../components/icons/Logo';
import withStackContainerShell from '../../hoc/withStackContainerShell';
import { Link, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { ROLES } from '../../values/roles';

const MotionBox = motion.create(Box);
const MotionTypography = motion.create(Typography);

const textContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25,
      delayChildren: 0.4,
    }
  }
};

const textItemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

function Presentation() {

  const user = useSelector(state => state.user);
  const isOwner = user?.role === ROLES.OWNER.NAME;

  const navigate = useNavigate();
  const [isReady, setIsReady] = useState(false);

  const scrollToPageTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }

  const Screenshot = ({ src, alt }) => {
    return <img 
      src={src}
      alt={alt ?? src}
      style={{ flexGrow: 1, maxWidth: "49%" }}
    />
  }

  const ScreenshotStack = ({ children }) => {
    return <Stack
      direction="row"
      spacing={1}
      sx={{ width: "100%", overflow: "hidden", justifyContent: "center" }}>
      {children}
    </Stack>
  }

  const NavigationButton = ({ children, to, blank = false }) => {
    return <Link to={to} target={blank ? "_blank" : undefined} style={{ width: "100%", maxWidth: "400px" }}>
      <Button variant="contained" sx={{ width: "100%" }}>
        {children}
      </Button>
    </Link>
  }

  useTitle({ tabTitle: "Онлайн меню: QR-код меню для кафе и ресторанов", headerTitle: "Главная" }, []);

  useEffect(() => {
    if (document.readyState === 'complete') {
      setTimeout(() => setIsReady(true), 1_000)
    } else {
      const handleLoad = () => setTimeout(() => setIsReady(true), 1_000);
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  return (
    <>
      <Box sx={{ width: "100%", aspectRatio: "1 / 1", overflow: "hidden", position: "relative" }}>

        <MotionBox
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: `url(${process.env.PUBLIC_URL + '/bg_presentation.png'})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            zIndex: 1,
          }}
        />

        <Stack
          direction="column"
          sx={{
            position: "relative",
            zIndex: 2,
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MotionBox
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isReady ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            sx={{
              width: { xs: 60, sm: 80, md: 100 },
              height: { xs: 60, sm: 80, md: 100 },
              mb: 1,
            }}
          >
            <Logo width="100%" height="100%" bg="circle" />
          </MotionBox>

          <motion.div
            variants={textContainerVariants}
            initial="hidden"
            animate={isReady ? "visible" : "hidden"}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
          >
            <MotionTypography
              variants={textItemVariants}
              variant='h2'
              sx={{
                fontSize: { xs: '1.3rem', sm: '2.0rem', md: '2.5rem' },
                lineHeight: 1.2
              }}
            >
              <b>Онлайн меню</b>
            </MotionTypography>

            <MotionTypography
              variants={textItemVariants}
              variant='h5'
              sx={{
                fontSize: { xs: '0.8rem', sm: '1.2rem', md: '1.25rem' },
                letterSpacing: { xs: '1px', sm: '2px' }
              }}
            >
              МЕНЮ ПО QR-КОДУ
            </MotionTypography>
          </motion.div>
        </Stack>
      </Box>

      <Stack direction="column" spacing={2} alignItems="center" sx={{ p: 2, textAlign: "center" }}>

        <Typography variant="h6">Хотите создать меню для своего заведения?</Typography>
        {!isOwner && <NavigationButton to="/auth">Войдите в аккаунт</NavigationButton>}
        {isOwner && <NavigationButton to="/o/menu">Перейдите в «Мои онлайн меню»</NavigationButton>}
        
        <Typography variant="h6">Подробности и примеры</Typography>
        <Typography variant="body1">
          Наш сервис позволяет создавать гибкие электронные меню, доступные для просмотра по QR-коду.
          Сервис позволяет гостям заведений оформлять заказы по меню, а администраторам обрабатывать заказы и отслеживать статистику заказов и просмотров.
          Сервис рассчитан на владельцев и админисраторов кафе, ресторанов, столовых и других заведений общественного питания.
        </Typography>
        <NavigationButton to="/1" blank>
          Пример меню здесь!
        </NavigationButton>


        <Typography variant="h6">Как создать меню?</Typography>

        <Typography variant="body1"><b>Шаг 1.</b> Войдите или зарегистрируйтесь <span style={{ cursor: "pointer" }} onClick={scrollToPageTop}>⬆️⬆️⬆️</span></Typography>

        <Typography variant="body1"><b>Шаг 2.</b> Создайте новое меню и заполните его продуктами</Typography>
        
        <ScreenshotStack>
          <Screenshot src={process.env.PUBLIC_URL + '/presentation/1.png'} />
          <Screenshot src={process.env.PUBLIC_URL + '/presentation/2.png'} />
        </ScreenshotStack>

        <Typography variant="body1"><b>Шаг 3.</b> Получите QR-код и разместите его в заведении</Typography>

        <ScreenshotStack>
          <Screenshot src={process.env.PUBLIC_URL + '/presentation/3.png'} />
        </ScreenshotStack>

        <Typography variant="h6">Дополнительные возможности</Typography>

        <Typography variant="body1">Отслеживайте заказы и скачивайте статистику</Typography>

        <ScreenshotStack>
          <Screenshot src={process.env.PUBLIC_URL + '/presentation/4.png'} />
          <Screenshot src={process.env.PUBLIC_URL + '/presentation/5.png'} />
        </ScreenshotStack>

        <Alert severity="success" sx={{ py: 4 }}>
          <b>
            Создайте гибкое электронное меню для своего заведения прямо сейчас (или позже)
            <span style={{ cursor: "pointer" }} onClick={scrollToPageTop}>⬆️⬆️⬆️</span>
          </b>
        </Alert>

      </Stack>
    </>

  );
}

export default withStackContainerShell(Presentation, { p: 0 })