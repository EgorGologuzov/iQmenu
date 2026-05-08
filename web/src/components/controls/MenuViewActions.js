import React, { useState } from 'react'
import FilterListIcon from '@mui/icons-material/FilterList';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Button, ButtonGroup } from '@mui/material';
import ProductFiltersDialog from '../dialogs/ProductFiltersDialog';
import { deepCopy } from '../../utils/utils';
import { MENU_FILTERS_DEFAULT } from '../../values/default';
import OrderDialog from '../dialogs/OrderDialog';

function MenuViewActions({ filters, categories, products, onChange }) {

  const [isFiltersDialogOpen, setIsFiltersDialogOpen] = useState(false);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
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
          variant={ isFiltersApplied ? "contained" : "outlined" }
          sx={{ flexGrow: 1 }}
          onClick={() => setIsFiltersDialogOpen(true)}>
          <FilterListIcon />
        </Button>
        <Button
          variant={ filters.favoritesOnly ? "contained" : "outlined" }
          color="error"
          sx={{ flexGrow: 1 }}
          onClick={() => changeFiltersAttrs({ favoritesOnly: !filters.favoritesOnly })}>
          <FavoriteIcon />
        </Button>
        <Button
          variant="outlined"
          color="primary"
          sx={{ flexGrow: 1 }}
          onClick={() => setIsOrderDialogOpen(true)}>
          <ShoppingCartIcon />
        </Button>
      </ButtonGroup>

      <ProductFiltersDialog
        filters={dialogFilters}
        categories={categories}
        open={isFiltersDialogOpen}
        onClose={() => setIsFiltersDialogOpen(false)}
        onApply={handleOnApply}
        onReset={handleOnReset}
      />

      <OrderDialog
        products={products}
        open={isOrderDialogOpen}
        onClose={() => setIsOrderDialogOpen(false)}
      />
    </>
  )
}

export default MenuViewActions