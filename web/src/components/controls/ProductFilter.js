import React, { useState } from 'react'
import FilterListIcon from '@mui/icons-material/FilterList';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Button, ButtonGroup } from '@mui/material';
import ProductFiltersDialog from '../dialogs/ProductFiltersDialog';

const OPTIONS = Object.freeze({ NONE: -1, FILTERS: 0, FAVORITES: 1 });

const FILTERS_DEFAULT = Object.freeze({
  isActiveOnly: false,
  category: undefined,
});

function ProductFilter({ menu, onFilter }) {

  const [selectedOption, setSelectedOption] = useState(OPTIONS.NONE);
  const [filters, setFilters] = useState(FILTERS_DEFAULT);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleFilterButtonClick = () => {
    setIsDialogOpen(true);
  }

  const handleFavoriteButtonClick = () => {
    if (selectedOption != OPTIONS.FAVORITES) {
      setSelectedOption(OPTIONS.FAVORITES);
    } else {
      setSelectedOption(OPTIONS.NONE);
    }
  }

  const handleFiltersApply = (filters) => {
    setSelectedOption(OPTIONS.FILTERS);
    setFilters(filters);
  }

  const handleFiltersReset = () => {
    if (selectedOption == OPTIONS.FILTERS) {
      setSelectedOption(OPTIONS.NONE);
    }
    setFilters(FILTERS_DEFAULT);
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  }

  return (
    <>
      <ButtonGroup sx={{ width: "100%" }}>
        <Button
          startIcon={<FilterListIcon />}
          variant={ selectedOption == OPTIONS.FILTERS ? "contained" : "outlined" }
          sx={{ flexGrow: 1 }}
          onClick={handleFilterButtonClick}
        >
          Фильтры
        </Button>
        <Button
          startIcon={<FavoriteIcon />}
          variant={ selectedOption == OPTIONS.FAVORITES ? "contained" : "outlined" }
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
        filters={filters}
        onClose={handleDialogClose}
        onApply={handleFiltersApply}
        onReset={handleFiltersReset}
      />
    </>
  )
}

export default ProductFilter