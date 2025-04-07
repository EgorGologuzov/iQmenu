import React, { useState } from 'react'
import useIQmenuApi from "../../hooks/useIQmenuApi"
import { useParams } from "react-router"
import { Container, Stack, Grid } from "@mui/material"
import useTitle from "../../hooks/useTitle"
import ProductInfoDialog from '../../components/dialogs/ProductInfoDialog'
import ProductViewCard from '../../components/cards/ProductViewCard'

function MenuView() {
  const services = useIQmenuApi();
  const { menuId } = useParams();
  const menu = services.menu.getById(menuId);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const showProductDialog = (product) => {
    setSelectedProduct(product);
    setDialogOpen(true);
  }

  const hideProductDialog = () => {
    setSelectedProduct(null);
    setDialogOpen(false);
  }

  useTitle({ general: menu ? [menu.companyName, menu.menuName].join(" / ") : undefined }, [menu.companyName, menu.menuName]);

  return (
    <>
      <Container sx={{ pt: "1rem", pb: "1rem" }}>
        <Stack direction="column" spacing={3} alignItems="center">

          <Grid container spacing={1}>
            {menu.products.map((product, _) =>
              <Grid key={product.name} size={{ xs: 6, sm: 4, md: 3 }}>
                <ProductViewCard product={product} onClick={() => showProductDialog(product)} />
              </Grid>
            )}
          </Grid>

        </Stack>
      </Container>

      <ProductInfoDialog product={selectedProduct} open={dialogOpen} onClose={hideProductDialog} />
    </>
  )
}

export default MenuView