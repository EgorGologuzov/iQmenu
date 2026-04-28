import { Box, Container } from '@mui/material'
import React from 'react'
import { Outlet } from 'react-router'

function EmptyLayout() {
  return (
    <Container sx={{
      minHeight: '100vh',
      display: 'flex',
      alignContent: 'center',
      placeContent: 'center',
      flexWrap: 'wrap',
      maxWidth: '100% !important',
      backgroundImage: `url(${process.env.PUBLIC_URL + '/bg_empty-layout.jpg'})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <Outlet />
    </Container>
  )
}

export default EmptyLayout