import { Avatar, Box, Card, CardMedia, Chip, Stack, Typography } from '@mui/material'
import React, { memo } from 'react'
import ProductFavoriteButton from '../controls/ProductFavoriteButton';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import { joinWithApiBaseUrl } from '../../utils/utils';
import ProductInCartControl from '../controls/ProductInCartControl';
import CartButton from '../controls/CartButton';

function ProductViewCard({ product, onClick }) {

  const onClickHandler = () => {
    onClick && onClick(product);
  }

  return (
    <Card sx={{
        border: '2px solid transparent',
        '&:hover': {
          borderColor: 'primary.main',
          boxShadow: 3,
        },
      }}>

      <Box position="relative">

        {/* Картинка */}
        <Box sx={{ width: "100%", aspectRatio: "1 / 1" }}>
          <Avatar
            variant="square"
            src={joinWithApiBaseUrl(product.image)}
            onClick={onClickHandler}
            sx={{ cursor: "pointer", width: "100%", height: "100%" }}
          >
            <FastfoodIcon sx={{ width: 80, height: 80 }} />
          </Avatar>
        </Box>

        {/* Предупреждение о наличии */}
        {product.isActive === false && (
          <Chip
            label="Нет в наличии"
            color="error"
            size="small"
            sx={{ position: "absolute", bottom: 8, left: 8 }}
          />
        )}

      </Box>

      {/* Содержимое */}
      <Stack direction="column" sx={{ p: 0.5 }}>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="button" component="div" color="secondary" onClick={onClickHandler} sx={{ cursor: "pointer" }}>
            {product.price}₽
          </Typography>
          <Stack direction="row">
            <CartButton product={product} sx={{ pt: 0.25 }}/>
            <ProductFavoriteButton product={product} sx={{ pt: 1, pr: 0 }} />
          </Stack>
        </Stack>

        <Stack direction="column">
          <Typography
            noWrap
            variant="caption"
            onClick={onClickHandler}
            sx={{
              cursor: 'pointer',
              textOverflow: 'ellipsis',
              fontWeight: 500
            }}>
            {product.name}
          </Typography>
        </Stack>

      </Stack>
      
    </Card>
  )
}

export default memo(ProductViewCard)