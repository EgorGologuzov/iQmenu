import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import useIQmenuApi from "../../hooks/useIQmenuApi"
import { useParams } from "react-router"
import { Grid, Alert, CircularProgress, Typography, Divider } from "@mui/material"
import useTitle from "../../hooks/useTitle"
import ProductInfoDialog from '../../components/dialogs/ProductInfoDialog'
import ProductViewCard from '../../components/cards/ProductViewCard'
import { useQuery } from '@tanstack/react-query'
import withStackContainerShell from '../../hoc/withStackContainerShell'
import ProductFilter from '../../components/controls/ProductFilter'
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
                <Divider />
                <Typography component="h6" variant="h6" textAlign="center" sx={{ my: 1 }}>
                  {group.groupName}
                </Typography>
                <Divider />
              </Grid>
              {group.products.map((product, _) =>
                <Grid key={product.name} size={{ xs: 6, sm: 4, md: 3 }}>
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
    queryKey: ["MenuView/getMenuById"],
    queryFn: () => api.menu.getById(menuId),
  })

  const filterProducts = (products) => {
    if (!filters) {
      return products;
    }

    let result = [...products];

    if (filters.favoritesOnly) {
      if (favorites && favorites.products) {
        result = result.filter(product => favorites.products.includes(product.name));
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

  const sortProducts = (products) => {
    return products.toSorted((p1, p2) => {
      if (p1.isActive != p2.isActive) {
        return p1.isActive ? -1 : 1;
      }

      return p1.name < p2.name ? -1 : 1;
    })
  }

  const groupProducts = (products) => {
    const groups = [];

    menu.categories && menu.categories.length && menu.categories.forEach(
      category => groups.push({
        groupName: category,
        products: sortProducts(products.filter(product => product.categories.includes(category))),
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
    return <CircularProgress />
  }

  if (error) {
    return <Alert severity="error">{error.message}</Alert>
  }

  if (!menu) {
    return <Alert severity="info">Меню не найдено...</Alert>
  }

  return (
    <>
      <ProductFilter
        filters={filters}
        categories={menu.categories}
        onChange={handleFiltersChange}
      />

      {(!displayGroups || !displayGroups.length) &&
        <Alert severity="info">Ни один продукт не прошел фильтры... Попробуйет сбросить их!</Alert>
      }

      {isPrerender && <CircularProgress />}

      {!isPrerender &&
        <CardGrid
          displayGroups={displayGroups}
          onCardClick={showProductDialog}
        />
      }

      <ProductInfoDialog product={selectedProduct} open={isDialogOpen} onClose={hideProductDialog} />
    </>
  )
}

export default withStackContainerShell(MenuView)