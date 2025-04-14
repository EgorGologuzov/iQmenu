import { Link as MuiLink } from '@mui/material'
import React from 'react'
import { Link as RrLink } from 'react-router'

const CLink = ({ children, to }) => {
  return (
    <RrLink to={to}>
      <MuiLink color='secondary'>
        {children}
      </MuiLink>
    </RrLink>
  )
}

export default CLink