import { Container, Stack } from '@mui/material'
import React from 'react'

function withStackContainerShell(Component) {
  return function (props) {
    return (
      <Container sx={{ py: 2 }}>
        <Stack direction="column" spacing={2} alignItems="center">
          <Component {...props} />
        </Stack>
      </Container>
    )
  }
}

export default withStackContainerShell