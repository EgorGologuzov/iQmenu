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
      bgcolor: 'grey.200'
    }}>
      <Outlet />
    </Container>
  )
}

export default EmptyLayout