import { Container, Stack } from '@mui/material'
import React from 'react'

function withStackContainerShell(Component) {
  return function (props) {
    return (
      <Stack
        direction="column"
        spacing={2}
        sx={{ p: 2, width: { xs: 'calc(100vw - 8px)', sm: '600px' } }}>
        <Component {...props} />
      </Stack>
    )
  }
}

export default withStackContainerShell