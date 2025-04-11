import { Stack, Switch, Typography } from '@mui/material'
import React from 'react'

function SwitchInput({ id, name, label, checked, onChange }) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" >
      <Typography variant="subtitle1">{ label }</Typography>
      <Switch
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
      />
    </Stack>
  )
}

export default SwitchInput