import { Button, Dialog, DialogActions, DialogContent, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Switch, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

function ProductFiltersDialog({ menu, filters, onClose, onApply, onReset, ...otherProps }) {

  const [filtersEdit, setFiltersEdit] = useState({ ...filters });

  const handleApplyButtonClick = () => {
    onApply && onApply(filtersEdit);
    onClose && onClose();
  }

  const handleResetButtonClick = () => {
    onReset && onReset();
    onClose && onClose();
  }

  const handleIsActiveOnlySwitchChange = (event) => setFiltersEdit({ ...filtersEdit, isActiveOnly: event.target.checked });

  const handleAllCategoriesSwitchChange = (event) => {
    if (event.target.checked) {
      setFiltersEdit({ ...filtersEdit, category: undefined });
    }
  }

  const handleCategoryButtonClick = (category) => {
    setFiltersEdit({ ...filtersEdit, category })
  }

  useEffect(() => {
    setFiltersEdit(filters);
  }, [filters])

  return (
    <Dialog {...otherProps} onClose={onClose} maxWidth="sm" fullWidth>

      <DialogContent sx={{ p: 0 }}>
        <Stack direction="column" spacing={1} sx={{ p: 2 }}>

          <Stack direction="row" justifyContent="space-between" alignItems="center" >
            <Typography variant="subtitle1" gutterBottom>Есть в наличии:</Typography>
            <Switch checked={filtersEdit.isActiveOnly} onChange={handleIsActiveOnlySwitchChange} />
          </Stack>

          {menu.categories && menu.categories.length && (
            <>
              <Divider sx={{ my: 2 }} />

              <Stack direction="row" justifyContent="space-between" alignItems="center" >
                <Typography variant="subtitle1" gutterBottom>Все категории:</Typography>
                <Switch checked={!filtersEdit.category} onChange={handleAllCategoriesSwitchChange} />
              </Stack>

              <List>
                {menu.categories.map((category, _) => 
                  <ListItem key={category} disablePadding>
                    <ListItemButton onClick={() => handleCategoryButtonClick(category)}>
                      <ListItemIcon>
                        {filtersEdit.category == category ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
                      </ListItemIcon>
                      <ListItemText primary={category} />
                    </ListItemButton>
                  </ListItem>
                )}
              </List>
            </>
          )}

        </Stack>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" sx={{ flexGrow: 1 }} onClick={handleResetButtonClick}>Сбросить</Button>
        <Button variant="contained" sx={{ flexGrow: 1 }} onClick={handleApplyButtonClick}>Применить</Button>
      </DialogActions>

    </Dialog>
  )
}

export default ProductFiltersDialog