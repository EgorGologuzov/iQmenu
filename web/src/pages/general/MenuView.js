import React, { useEffect, useState } from 'react'
import useIQmenuApi from "../../hooks/useIQmenuApi"
import { useParams } from "react-router"
import { Grid, Alert, CircularProgress, Typography, Divider } from "@mui/material"
import useTitle from "../../hooks/useTitle"
import ProductInfoDialog from '../../components/dialogs/ProductInfoDialog'
import ProductViewCard from '../../components/cards/ProductViewCard'
import { useQuery } from '@tanstack/react-query'
import withStackContainerShell from '../../hoc/withStackContainerShell'
import ProductFilter from '../../components/controls/ProductFilter'
import { useDispatch, useSelector } from 'react-redux'
import { setFilters } from '../../store/slices/pageSlice'
import { MENU_FILTERS_DEFAULT } from '../../values/default'
import { arraysIntersection, deepCopy } from '../../utils/utils'

function MenuView() {
  const service = useIQmenuApi();
  const { menuId } = useParams();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filters = useSelector(state => state.page.filters);
  const favorites = useSelector(state => state.favorite.find(record => record.menuId == menuId));
  const dispatch = useDispatch();

  const { data: menu, isLoading, error } = useQuery({
    queryKey: ["MenuView/getMenuById"],
    queryFn: () => service.menu.getById(menuId),
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
      groupName: "Временно недоступны",
      products: products.filter(product => !product.isActive),
    })

    return groups.filter(group => group.products && group.products.length);
  }

  const showProductDialog = (product) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  }

  const hideProductDialog = () => {
    setSelectedProduct(null);
    setIsDialogOpen(false);
  }

  useTitle({ general: menu ? [menu.companyName, menu.menuName].join(" / ") : undefined }, [menu]);

  useEffect(() => {
    dispatch(setFilters(deepCopy(MENU_FILTERS_DEFAULT)));
    return () => dispatch(setFilters(undefined));
  }, [])

  if (isLoading) {
    return <CircularProgress />
  }

  if (error) {
    return <Alert severity="error">{error.message}</Alert>
  }

  if (!menu) {
    return <Alert severity="info">Меню не найдено...</Alert>
  }

  const displayProducts = filterProducts(menu.products);
  const displayGroups = groupProducts(displayProducts);

  return (
    <>
      <ProductFilter menu={menu} />

      {(!displayGroups || !displayGroups.length) &&
        <Alert severity="info">Ни один продукт не прошел фильтры... Попробуйет сбросить их!</Alert>
      }

      {displayGroups && displayGroups.length != 0 &&
        <Grid container spacing={1} sx={{ width: "100%" }}>
          {displayGroups.map(group =>
            <React.Fragment key={group.groupName}>
              <Grid size={{ xs: 12 }}>
                <Divider />
                <Typography component="h6" variant="h6" textAlign="center" sx={{ my: 1 }}>
                  { group.groupName }
                </Typography>
                <Divider />
              </Grid>
              {group.products.map((product, _) =>
                <Grid key={product.name} size={{ xs: 6, sm: 4, md: 3 }}>
                  <ProductViewCard product={product} onClick={() => showProductDialog(product)} />
                </Grid>
              )}
            </React.Fragment>
          )}
        </Grid>
      }

      <ProductInfoDialog product={selectedProduct} open={isDialogOpen} onClose={hideProductDialog} />
    </>
  )
}

export default withStackContainerShell(MenuView)