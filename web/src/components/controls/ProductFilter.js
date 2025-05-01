import React, { useState } from 'react'
import FilterListIcon from '@mui/icons-material/FilterList';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Button, ButtonGroup } from '@mui/material';
import ProductFiltersDialog from '../dialogs/ProductFiltersDialog';
import { deepCopy } from '../../utils/utils';
import { MENU_FILTERS_DEFAULT } from '../../values/default';

function ProductFilter({ filters, categories, onChange }) {

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isFiltersApplied, setIsFiltersApplied] = useState(false);

  const dialogFilters = { 
    isActiveOnly: filters.isActiveOnly,
    categories: filters.categories,
  };

  const changeFiltersAttrs = (newAttrs) => {
    onChange && onChange({ ...filters, ...newAttrs });
  }

  const handleOnApply = (dialogFilters) => {
    changeFiltersAttrs(dialogFilters);
    setIsFiltersApplied(true);
  }

  const handleOnReset = () => {
    changeFiltersAttrs(deepCopy(MENU_FILTERS_DEFAULT));
    setIsFiltersApplied(false);
  }

  return (
    <>
      <ButtonGroup sx={{ width: "100%" }}>
        <Button
          startIcon={<FilterListIcon />}
          variant={ isFiltersApplied ? "contained" : "outlined" }
          sx={{ flexGrow: 1 }}
          onClick={() => setIsDialogOpen(true)}
        >
          Фильтры
        </Button>
        <Button
          startIcon={<FavoriteIcon />}
          variant={ filters.favoritesOnly ? "contained" : "outlined" }
          color="error"
          sx={{ flexGrow: 1 }}
          onClick={() => changeFiltersAttrs({ favoritesOnly: !filters.favoritesOnly })}
        >
          Избранное
        </Button>
      </ButtonGroup>

      <ProductFiltersDialog
        filters={dialogFilters}
        categories={categories}
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onApply={handleOnApply}
        onReset={handleOnReset}
      />
    </>
  )
}

export default ProductFilter