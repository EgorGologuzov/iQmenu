import { Button, Dialog, DialogActions, DialogContent, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Switch, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters } from '../../store/slices/pageSlice';
import { MENU_FILTERS_DEFAULT } from '../../values/default';
import { deepCopy } from '../../utils/utils';

function ProductFiltersDialog({ menu, onClose, onApply, onReset, ...otherProps }) {

  const filters = useSelector(state => state.page.filters);
  const [filtersEdit, setFiltersEdit] = useState({ ...filters });
  const dispatch = useDispatch();
  
  const handleApplyButtonClick = () => {
    dispatch(setFilters(deepCopy(filtersEdit)));
    onApply && onApply();
    onClose && onClose();
  }

  const handleResetButtonClick = () => {
    dispatch(setFilters(deepCopy(MENU_FILTERS_DEFAULT)));
    setFiltersEdit(deepCopy(MENU_FILTERS_DEFAULT));
    onReset && onReset();
    onClose && onClose();
  }

  const handleIsActiveOnlySwitchChange = (event) => {
    const newFilters = deepCopy(filtersEdit);
    newFilters.isActiveOnly = event.target.checked;
    setFiltersEdit(newFilters);
  }

  const handleAllCategoriesSwitchChange = (event) => {
    if (event.target.checked) {
      const newFilters = deepCopy(filtersEdit);
      newFilters.categories = [];
      setFiltersEdit(newFilters);
    }
  }

  const handleCategoryButtonClick = (category) => {
    if (filtersEdit.categories.includes(category)) {
      const index = filtersEdit.categories.indexOf(category);
      filtersEdit.categories.splice(index, 1);
    } else {
      filtersEdit.categories.push(category);
    }
    
    setFiltersEdit(deepCopy(filtersEdit));
  }

  useEffect(() => {
    setFiltersEdit(deepCopy(filters));
  }, [JSON.stringify(filters)])

  return (
    <Dialog {...otherProps} onClose={onClose} maxWidth="xs" fullWidth>

      <DialogContent sx={{ p: 0 }}>
        <Stack direction="column" spacing={1} sx={{ p: 2 }}>

          <Stack direction="row" justifyContent="space-between" alignItems="center" >
            <Typography variant="subtitle1" gutterBottom>Есть в наличии:</Typography>
            <Switch checked={filtersEdit.isActiveOnly} onChange={handleIsActiveOnlySwitchChange} />
          </Stack>

          {menu.categories && menu.categories.length != 0 && (
            <>
              <Divider sx={{ my: 2 }} />

              <Stack direction="row" justifyContent="space-between" alignItems="center" >
                <Typography variant="subtitle1" gutterBottom>Все категории:</Typography>
                <Switch
                  checked={!filtersEdit.categories || filtersEdit.categories.length == 0}
                  onChange={handleAllCategoriesSwitchChange} 
                />
              </Stack>

              <List>
                {menu.categories.map((category, _) => 
                  <ListItem key={category} disablePadding>
                    <ListItemButton onClick={() => handleCategoryButtonClick(category)}>
                      <ListItemIcon>
                        { 
                          filtersEdit.categories && filtersEdit.categories.includes(category) 
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
        <Button variant="outlined" sx={{ flexGrow: 1 }} onClick={handleResetButtonClick}>Сбросить</Button>
        <Button variant="contained" sx={{ flexGrow: 1 }} onClick={handleApplyButtonClick}>Применить</Button>
      </DialogActions>

    </Dialog>
  )
}

export default ProductFiltersDialog