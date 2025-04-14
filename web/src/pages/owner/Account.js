import { Avatar, Grid, Icon, Typography, IconButton, FormControl, TextField, Stack, Button} from '@mui/material'
import { styled } from '@mui/material/styles';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';

function Account() {
  const { name, avatar } = useSelector(state => state.user);

  const [currentName, setCurrentName] = useState(name);
  const [currentAvatar, setCurrentAvatar] = useState(avatar);

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  return (
    <Grid sx={{placeSelf:'center', maxWidth:'1000px',paddingTop:'40px', paddingX:'5px'}} container columnSpacing={4}>
      <Grid size={{xs:12,sm:3}} textAlign={'center'}>
        <IconButton sx={{width:'100%',aspectRatio:'1/1', maxWidth:'200px'}} component='label' tabIndex={-1}>
          <Avatar src={avatar} sx={{width:'100%',height:'100%'}}/>
          <VisuallyHiddenInput
          type="file"
          onChange={(event) => setCurrentAvatar(event.target.files)}
          multiple
        />
        </IconButton>
      </Grid>
      <Grid size={{xs:12, sm:9}} alignContent={'center'}>
        <Stack spacing={2}>
          <FormControl
          fullWidth
          color='primary'>
            <TextField id="outlined-basic" variant="filled" size='small' value={currentName} label="Ваше ФИО" onChange={(event)=>setCurrentName(event.target.value)}/>
          </FormControl>
          <FormControl
          fullWidth
          color='primary'>
            <TextField id="outlined-basic" label="Ваше ФИО" variant="filled" size='small'/>
          </FormControl>
          <FormControl
          fullWidth
          color='primary'>
            <TextField id="outlined-basic" label="Ваше ФИО" variant="filled" size='small'/>
          </FormControl>
        </Stack>
      </Grid>
      <Grid size='grow' alignItems={'stretch'} marginTop={5}>
        <Stack direction={'row'} justifyContent={'space-evenly'}>
          <Button variant='outlined'>Отменить изменения</Button>
          <Button variant='contained'>Применить</Button>
        </Stack>
      </Grid>
    </Grid>
  )
}

export default Account