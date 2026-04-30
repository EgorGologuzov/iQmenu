import { Avatar, Box, Card, CardMedia, Chip, Stack, Typography } from '@mui/material'
import React, { memo } from 'react'
import ProductFavoriteButton from '../controls/ProductFavoriteButton';
import FastfoodIcon from '@mui/icons-material/Fastfood';

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
            src={product.image}
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
      <Stack direction="column" sx={{ p: 1 }}>

        <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
          <Typography variant="h6" component="div" color="secondary" onClick={onClickHandler} sx={{ cursor: "pointer" }}>
            {product.price}₽
          </Typography>
          <ProductFavoriteButton product={product} />
        </Stack>

        <Stack
          direction="column"
          sx={{
            justifyContent: 'center',
            minHeight: '45px',
          }}>
          <Typography
            variant="subtitle2"
            component="div"
            onClick={onClickHandler}
            sx={{
              cursor: 'pointer',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: '2',
              WebkitBoxOrient: 'vertical',
            }}>
            {product.name}
          </Typography>
        </Stack>

      </Stack>

    </Card>
  )
}

export default memo(ProductViewCard)