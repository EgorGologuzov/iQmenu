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
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${process.env.PUBLIC_URL + '/bg_empty-layout.jpg'})`,
      backgroundRepeat: 'repeat'
    }}>
      <Outlet />
    </Container>
  )
}

export default EmptyLayout