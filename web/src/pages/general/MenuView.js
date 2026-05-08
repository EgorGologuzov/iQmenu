import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import useIQmenuApi from "../../hooks/useIQmenuApi"
import { useParams } from "react-router"
import { Grid, Alert, CircularProgress, Typography, Divider } from "@mui/material"
import useTitle from "../../hooks/useTitle"
import ProductInfoDialog from '../../components/dialogs/ProductInfoDialog'
import ProductViewCard from '../../components/cards/ProductViewCard'
import { useQuery } from '@tanstack/react-query'
import withStackContainerShell from '../../hoc/withStackContainerShell'
import MenuViewActions from '../../components/controls/MenuViewActions'
import { useSelector } from 'react-redux'
import { MENU_FILTERS_DEFAULT } from '../../values/default'
import { arraysIntersection, deepCopy } from '../../utils/utils'

const CardGrid = memo(({ displayGroups, onCardClick }) => {
  return (
    <>
      {displayGroups && displayGroups.length != 0 &&
        <Grid container spacing={1} sx={{ width: "100%" }}>
          {displayGroups.map(group =>
            <React.Fragment key={group.groupName}>
              <Grid size={{ xs: 12 }}>
                <Typography component="h6" variant="subtitle2" textAlign="center">
                  {group.groupName}
                </Typography>
              </Grid>
              {group.products.map((product, _) =>
                <Grid key={product.name} size={{ xs: 6, md: 4 }}>
                  <ProductViewCard product={product} onClick={onCardClick} />
                </Grid>
              )}
            </React.Fragment>
          )}
        </Grid>
      }
    </>
  )
})

function MenuView() {
  const api = useIQmenuApi();
  const { menuId } = useParams();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filters, setFilters] = useState(deepCopy(MENU_FILTERS_DEFAULT));
  const [isPrerender, setIsPrerender] = useState(true);

  const favorites = useSelector(state => state.favorite.find(record => record.menuId == menuId));

  const { data: menu, isLoading, error } = useQuery({
    queryKey: ["MenuView/api.menu.getById"],
    queryFn: () => api.menu.getById(menuId),
  })

  const filterProducts = (products) => {
    if (!filters) {
      return products;
    }

    let result = [...products];

    if (filters.favoritesOnly) {
      if (favorites && favorites.products) {
        result = result.filter(product => favorites.products.includes(product.id));
      } else {
        result = result.filter(_ => false);
      }
    }

    if (filters.isActiveOnly) {
      result = result.filter(product => product.isActive);
    }

    if (filters.categories && filters.categories.length) {
      result = result.filter(product => arraysIntersection(product.categories, filters.categories).length);
    }

    return result;
  }

  const groupProducts = (products) => {
    const groups = [];

    menu.categories && menu.categories.length && menu.categories.forEach(
      category => groups.push({
        groupName: category,
        products: products.filter(product => product.categories.includes(category)),
      })
    )

    groups.push({
      groupName: "Без категории",
      products: products.filter(product => !product.categories || !product.categories.length),
    })

    groups.push({
      groupName: "Временно недоступны",
      products: products.filter(product => !product.isActive),
    })

    return groups.filter(group => group.products && group.products.length);
  }

  const hideProductDialog = () => {
    setSelectedProduct(null);
    setIsDialogOpen(false);
  }

  const title = menu ? [menu.companyName, menu.menuName].filter(Boolean).join(" / ") : undefined;
  useTitle({ general: title }, [title]);

  const displayProducts = useMemo(
    () => menu?.products ? filterProducts(menu.products) : undefined,
    [filters, menu?.products]
  );

  const displayGroups = useMemo(
    () => displayProducts ? groupProducts(displayProducts) : undefined,
    [displayProducts]
  );

  const showProductDialog = useCallback((product) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  }, [])

  const handleFiltersChange = useCallback((filters) => {
    setFilters(filters);
    setIsPrerender(true);
  }, [])

  useEffect(() => {
    if (isPrerender) setTimeout(() => setIsPrerender(false), 500);
  });

  if (isLoading) {
    return <CircularProgress disableShrink sx={{ alignSelf: 'center' }} />
  }

  if (error) {
    return <Alert severity="error">{error.message}</Alert>
  }

  if (!menu) {
    return <Alert severity="info">Меню не найдено...</Alert>
  }

  return (
    <>
      <MenuViewActions
        filters={filters}
        categories={menu.categories}
        products={menu.products}
        onChange={handleFiltersChange}
      />

      {(!displayGroups || !displayGroups.length) &&
        <Alert severity="info">Ни один продукт не прошел фильтры... Попробуйет сбросить их!</Alert>
      }

      {isPrerender && <CircularProgress disableShrink sx={{ alignSelf: 'center' }} />}

      {!isPrerender &&
        <CardGrid
          displayGroups={displayGroups}
          onCardClick={showProductDialog}
        />
      }

      {!isPrerender &&
        <Typography variant="caption" sx={{ color: 'primary.main' }}>
          {`* ${title}`}
        </Typography>
      }

      <ProductInfoDialog product={selectedProduct} open={isDialogOpen} onClose={hideProductDialog} />
    </>
  )
}

export default withStackContainerShell(MenuView)