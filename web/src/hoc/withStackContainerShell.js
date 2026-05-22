import { Container, Stack } from '@mui/material'
import React from 'react'

function withStackContainerShell(Component, args = { p: 2 }) {
  const { p } = args;
  return function (props) {
    return (
      <Stack
        direction="column"
        spacing={2}
        sx={{ p: p, width: { xs: 'calc(100vw - 8px)', sm: '600px' } }}>
        <Component {...props} />
      </Stack>
    )
  }
}

export default withStackContainerShell