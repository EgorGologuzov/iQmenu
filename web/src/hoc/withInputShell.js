import { Alert, Stack, Typography } from '@mui/material'
import React from 'react'

function withInputShell(Component) {
  return function ({ label, helperText, error, ...otherProps }) {

    if (!label && !helperText) {
      return <Component {...otherProps} />;
    }

    return (
      <Stack direction="column" spacing={1}>
        {label && (
          <Typography variant="subtitle1">
            {label}:
          </Typography>
        )}

        {helperText && (
          <Alert severity={error ? "error" : "info"}>
            {helperText}
          </Alert>
        )}

        <Component {...otherProps} />
      </Stack>
    )
  }
}

export default withInputShell