import React, { useState } from 'react'
import useIQmenuApi from "../../hooks/useIQmenuApi"
import { useParams } from "react-router"
import { Grid, Alert, CircularProgress } from "@mui/material"
import useTitle from "../../hooks/useTitle"
import ProductInfoDialog from '../../components/dialogs/ProductInfoDialog'
import ProductViewCard from '../../components/cards/ProductViewCard'
import { useQuery } from '@tanstack/react-query'
import withStackContainerShell from '../../hoc/withStackContainerShell'
import ProductFilter from '../../components/controls/ProductFilter'

function MenuView() {
  const service = useIQmenuApi();
  const { menuId } = useParams();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { data: menu, isLoading, error } = useQuery({
    queryKey: ["MenuView/getMenuById"],
    queryFn: () => service.menu.getById(menuId),
  })

  const showProductDialog = (product) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  }

  const hideProductDialog = () => {
    setSelectedProduct(null);
    setIsDialogOpen(false);
  }

  useTitle({ general: menu ? [menu.companyName, menu.menuName].join(" / ") : undefined }, [menu]);

  if (isLoading) {
    return <CircularProgress />
  }

  if (error) {
    return <Alert severity="error">{ error.message }</Alert>
  }

  if (!menu) {
    return <Alert severity="info">Меню не найдено...</Alert>
  }

  return (
    <>
      <ProductFilter menu={menu} />

      <Grid container spacing={1}>
        {menu.products.map((product, _) =>
          <Grid key={product.name} size={{ xs: 6, sm: 4, md: 3 }}>
            <ProductViewCard product={product} onClick={() => showProductDialog(product)} />
          </Grid>
        )}
      </Grid>

      <ProductInfoDialog product={selectedProduct} open={isDialogOpen} onClose={hideProductDialog} />
    </>
  )
}

export default withStackContainerShell(MenuView)