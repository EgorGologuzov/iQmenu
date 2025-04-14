import { Box } from '@mui/material'
import React from 'react'
import { Outlet } from 'react-router'

function EmptyLayout() {
  return (
    <Box sx={{
      minHeight:'100vh',
      display:'flex',
      alignContent:'center',
      placeContent:'center',
      flexWrap:'wrap',
      bgcolor:'#888888'
    }}>
      <Outlet />
    </Box>
  )
}

export default EmptyLayout