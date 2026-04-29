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
        alignItems: 'center',
        backgroundImage: `url(${process.env.PUBLIC_URL + '/bg_layout_1.jpg'})`,
        backgroundRepeat: 'repeat',
    }}>
      
      <GeneralHeader />

      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          bgcolor: 'white',
          width: 'fit-content',
          m: 0.5,
          borderRadius: "4px",
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Outlet />
      </Box>

      <GeneralFooter />

    </Box>
  )
}

export default GeneralLayout