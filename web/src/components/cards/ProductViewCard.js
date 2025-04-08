import { Box, Card, CardMedia, Chip, Stack, Typography } from '@mui/material'
import React from 'react'
import ProductFavoriteButton from '../controls/ProductFavoriteButton';

function ProductViewCard({ product, onClick }) {
  return (
    <Card>

      <Box position="relative">

        {/* Предупреждение о наличии */}
        {product.isActive === false && (
          <Chip
            label="Нет в наличии"
            color="error"
            size="small"
            sx={{ position: "absolute", bottom: 8, left: 8 }}
          />
        )}

        {/* Картинка */}
        <CardMedia
          component="img"
          height="200"
          image={product.image}
          alt={product.name}
          onClick={onClick}
          sx={{ cursor: "pointer" }}
        />

      </Box>

      {/* Содержимое */}
      <Stack direction="column" sx={{ p: 1 }}>

        <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
          <Typography variant="h6" component="div" color="secondary" onClick={onClick} sx={{ cursor: "pointer" }}>
            {product.price}₽
          </Typography>
          <ProductFavoriteButton product={product} />
        </Stack>

        <Typography variant="subtitle2" component="div" noWrap onClick={onClick} sx={{ cursor: "pointer" }}>
          {product.name}
        </Typography>

      </Stack>

    </Card>
  )
}

export default ProductViewCard