import React from 'react';
import {
  Dialog,
  DialogActions,
  Typography,
  Button,
  Chip,
  Divider,
  Box,
  Stack,
  IconButton,
  DialogContent,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';

const ProductInfoDialog = ({ open, onClose, product }) => {
  if (!product) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>

      <DialogContent sx={{ p: 0 }}>

        <Stack direction="column" spacing={1} sx={{ p: 2 }}>

          {/* Изображение продукта */}
          {product.image && (
            <Box
              component="img"
              sx={{ width: "100%", maxHeight: 500, aspectRatio: "1 / 1", objectFit: "cover", borderRadius: 2, alignSelf: "center" }}
              src={product.image}
              alt={product.name}
            />
          )}

          {/* Предупреждение о наличии */}
          {product.isActive === false && (
            <Chip label="Нет в наличии" color="error" size="small" />
          )}

          {/* Цена и кнопка добавить в избранное */}
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
            <Typography variant="h6" component="div" color="secondary">
              {product.price}₽
            </Typography>
            <IconButton aria-label="Добавить в избранное">
              <FavoriteIcon />
            </IconButton>
          </Stack>

          {/* Название */}
          <Typography variant="h6" component="div">
            {product.name}
          </Typography>

          {/* Вес */}
          {product.weight && (
            <Typography variant="body2" color="text.secondary">
              {product.weight} г
            </Typography>
          )}

          {/* Описание */}
          {product.description && (
            <Typography component="p" sx={{ mb: 2 }}>
              {product.description}
            </Typography>
          )}

          {/* Состав */}
          {product.composition && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" gutterBottom>
                Состав:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {product.composition}
              </Typography>
            </>
          )}

          {/* Категории */}
          {product.categories && product.categories.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" gutterBottom>
                Кактегории:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {product.categories.map((category, index) => (
                  <Chip key={index} label={category} size="small" />
                ))}
              </Box>
            </>
          )}
        </Stack>

      </DialogContent>

      {/* Кнопка закрытия */}
      <DialogActions>
        <Button onClick={onClose} variant="outlined" sx={{ width: "100%" }}>
          Закрыть
        </Button>
      </DialogActions>

    </Dialog>
  );
};

export default ProductInfoDialog;