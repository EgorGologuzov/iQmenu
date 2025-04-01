import React from 'react'
import { Outlet } from 'react-router'
import GeneralHeader from '../../components/navs/GeneralHeader'
import GeneralFooter from '../../components/navs/GeneralFooter'
import { Box } from '@mui/material'

function GeneralLayout() {
  return (
    <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
    }}>
      
      <GeneralHeader />

      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>

      <GeneralFooter />

    </Box>
  )
}

export default GeneralLayout