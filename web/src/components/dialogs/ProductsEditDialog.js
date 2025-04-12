import React, { useCallback, useEffect, useState } from 'react';
import {
  TextField,
  Stack,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Box
} from '@mui/material';
import SwitchInput from '../inputs/SwitchInput';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { validateProduct } from '../../data/models/validation';
import ImageInput from '../inputs/ImageInput';

const ProductEditDialog = ({ open, onClose, product, products, categories, onSave }) => {
  const [editedProduct, setEditedProduct] = useState(product);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedProduct(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCategoryChipClick = (category) => {
    if (editedProduct.categories.includes(category)) {
      setEditedProduct({ ...editedProduct, categories: editedProduct.categories.filter(c => c != category) })
    } else {
      setEditedProduct({ ...editedProduct, categories: [...editedProduct.categories, category] })
    }
  }

  const handleCancelButtonClick = () => {
    setEditedProduct(null);
    onClose && onClose();
  }

  const syncProductAndEditedProduct = () => {
    if (!product) {
      return;
    }
    else if (!editedProduct) {
      setEditedProduct({ ...product });
      return;
    }
    else if (editedProduct.id != product.id) {
      setEditedProduct({ ...product });
    }
  }

  useEffect(() => {
    syncProductAndEditedProduct();
  });

  if (!editedProduct) return;

  const isProductNameDublicate = products.some(p => p.name === editedProduct.name && p.id != editedProduct.id);
  const { isValid, errors } = validateProduct(editedProduct);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ pt: 1 }}>

          <ImageInput
            image={editedProduct.image}
            onChange={file => setEditedProduct({ ...editedProduct, image: file })}
          />

          <SwitchInput
            name="isActive"
            label="Есть в наличии"
            checked={editedProduct.isActive}
            onChange={handleChange}
          />

          <TextField
            name="name"
            label="Название"
            value={editedProduct.name}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            error={isProductNameDublicate || errors.name}
            helperText={isProductNameDublicate ? "Продукт с таким названием уже существует" : errors.name}
          />

          <TextField
            name="price"
            label="Цена (руб)"
            type="number"
            value={editedProduct.price}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            error={errors.price}
            helperText={errors.price}
          />

          <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", width: "100%", gap: 1 }}>
            {categories.map(category => (
              <Chip
                key={category}
                label={category}
                icon={editedProduct.categories.includes(category) ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
                color={editedProduct.categories.includes(category) ? "primary" : "default"}
                onClick={() => handleCategoryChipClick(category)}
                sx={{ cursor: 'pointer' }}
              />
            ))}
          </Box>

          <TextField
            name="weight"
            label="Вес (г)"
            type="number"
            value={editedProduct.weight}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={errors.weight}
            helperText={errors.weight}
          />

          <TextField
            name="composition"
            label="Состав"
            value={editedProduct.composition}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            rows={3}
            error={errors.composition}
            helperText={errors.composition}
          />

          <TextField
            name="description"
            label="Описание"
            value={editedProduct.description}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            rows={6}
            error={errors.description}
            helperText={errors.description}
          />

        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancelButtonClick}>Отмена</Button>
        <Button
          onClick={() => onSave && onSave(editedProduct)}
          variant="contained"
          disabled={isProductNameDublicate || !isValid}
        >
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductEditDialog