import { Button, Container, Divider, Stack, Typography } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router'

const ErrorBase = ({ code, title = "Ошибка", message = "Что-то пошло не так...", links }) => {
  const navigate = useNavigate();
  return (
    <Container sx={{
      minHeight: '100vh',
      display: 'flex',
      alignContent: 'center',
      placeContent: 'center',
      flexWrap: 'wrap',
      bgcolor: 'grey.200',
      maxWidth: '100% !important'
    }}>
      <Stack
        direction="column"
        spacing={2}
        alignItems="center"
        textAlign="center"
      >
        <Typography variant="h1">
          {code}
        </Typography>
        <Typography variant="h5">
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {message}
        </Typography>

        <Stack
          direction="column"
          spacing={1}
          sx={{ width: 1, maxWidth: "sm" }}
        >
          {links && links.length && (
            <>
              {links.map(link =>
                <Button
                  key={link.text}
                  variant="contained"
                  color="success"
                  onClick={() => navigate(link.to, { replace: true })}
                >
                  {link.text}
                </Button>
              )}
              <div></div>
              <Divider />
              <div></div>
            </>
          )}

          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/", { replace: true })}
          >
            Вернуться на главную
          </Button>

          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate(-1, { replace: true })}
          >
            Вернуться назад
          </Button>

        </Stack>

      </Stack>
    </Container>
  )
}

export default ErrorBase