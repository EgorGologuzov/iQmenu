import React, { useState } from 'react'
import FilterListIcon from '@mui/icons-material/FilterList';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Button, ButtonGroup } from '@mui/material';
import ProductFiltersDialog from '../dialogs/ProductFiltersDialog';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters } from '../../store/slices/pageSlice';
import { deepCopy } from '../../utils/utils';

function ProductFilter({ menu }) {

  const filters = useSelector(state => state.page.filters);
  const dispatch = useDispatch();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filtersApplied, setFiltersApplied] = useState(false);

  const handleFilterButtonClick = () => {
    setIsDialogOpen(true);
  }

  const setFavoritesOnly = (favoritesOnly) => {
    const newFilters = deepCopy(filters);
    newFilters.favoritesOnly = favoritesOnly;
    dispatch(setFilters(newFilters));
  }

  const handleFavoriteButtonClick = () => {
    setFavoritesOnly(!filters.favoritesOnly);
  }

  const handleFiltersApply = () => {
    setFiltersApplied(true);
  }

  const handleFiltersReset = () => {
    setFiltersApplied(false);
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  }

  return (
    <>
      <ButtonGroup sx={{ width: "100%" }}>
        <Button
          startIcon={<FilterListIcon />}
          variant={ filtersApplied ? "contained" : "outlined" }
          sx={{ flexGrow: 1 }}
          onClick={handleFilterButtonClick}
        >
          Фильтры
        </Button>
        <Button
          startIcon={<FavoriteIcon />}
          variant={ filters.favoritesOnly ? "contained" : "outlined" }
          color="error"
          sx={{ flexGrow: 1 }}
          onClick={handleFavoriteButtonClick}
        >
          Избранное
        </Button>
      </ButtonGroup>

      <ProductFiltersDialog
        menu={menu}
        open={isDialogOpen}
        onClose={handleDialogClose}
        onApply={handleFiltersApply}
        onReset={handleFiltersReset}
      />
    </>
  )
}

export default ProductFilter