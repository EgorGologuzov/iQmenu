import { Button, Dialog, DialogActions, DialogContent, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Switch, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { MENU_FILTERS_DEFAULT } from '../../values/default';
import { deepCopy } from '../../utils/utils';

const FILTERS_DEFAULT = Object.freeze({
  isActiveOnly: MENU_FILTERS_DEFAULT.isActiveOnly,
  categories: MENU_FILTERS_DEFAULT.categories,
})

function ProductFiltersDialog({ filters, categories, onClose, onApply, onReset, ...otherProps }) {

  const [editedFilters, setEditedFilters] = useState(filters || deepCopy(FILTERS_DEFAULT));
  
  const handleApplyButtonClick = () => {
    onApply && onApply(editedFilters);
    onClose && onClose();
  }

  const handleResetButtonClick = () => {
    setEditedFilters(deepCopy(FILTERS_DEFAULT));
    onReset && onReset();
    onClose && onClose();
  }

  const handleIsActiveOnlySwitchChange = (event) => {
    setEditedFilters({ ...editedFilters, isActiveOnly: event.target.checked });
  }

  const handleAllCategoriesSwitchChange = (event) => {
    if (event.target.checked) {
      setEditedFilters({ ...editedFilters, categories: [] });
    }
  }

  const handleCategoryButtonClick = (category) => {
    if (editedFilters.categories.includes(category)) {
      setEditedFilters({ ...editedFilters, categories: editedFilters.categories.filter(c => c != category) });
    } else {
      setEditedFilters({ ...editedFilters, categories: [...editedFilters.categories, category] });
    }
  }

  return (
    <Dialog {...otherProps} onClose={onClose} maxWidth="xs" fullWidth>

      <DialogContent sx={{ p: 0 }}>
        <Stack direction="column" spacing={1} sx={{ p: 2 }}>

          <Stack direction="row" justifyContent="space-between" alignItems="center" >
            <Typography variant="subtitle1" gutterBottom>Есть в наличии:</Typography>
            <Switch checked={editedFilters.isActiveOnly} onChange={handleIsActiveOnlySwitchChange} />
          </Stack>

          {categories && categories.length != 0 && (
            <>
              <Divider sx={{ my: 2 }} />

              <Stack direction="row" justifyContent="space-between" alignItems="center" >
                <Typography variant="subtitle1" gutterBottom>Все категории:</Typography>
                <Switch
                  checked={!editedFilters.categories || editedFilters.categories.length == 0}
                  onChange={handleAllCategoriesSwitchChange} 
                />
              </Stack>

              <List>
                {categories.map((category, _) => 
                  <ListItem key={category} disablePadding>
                    <ListItemButton onClick={() => handleCategoryButtonClick(category)}>
                      <ListItemIcon>
                        { 
                          editedFilters.categories && editedFilters.categories.includes(category) 
                          ? <CheckBoxIcon /> 
                          : <CheckBoxOutlineBlankIcon />
                        }
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
        <Button variant="text" onClick={handleResetButtonClick}>Сбросить</Button>
        <Button variant="contained" onClick={handleApplyButtonClick}>Применить</Button>
      </DialogActions>

    </Dialog>
  )
}

export default ProductFiltersDialog