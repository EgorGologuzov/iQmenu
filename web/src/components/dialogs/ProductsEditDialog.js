import React, { memo, useCallback, useEffect, useState } from 'react';
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
import { processProduct } from '../../data/models/processing';

const CategoriesList = ({ productCategories, categories, onChange }) => {

  const handleCategoryChipClick = (category) => {
    if (includesCategory(category)) {
      onChange(productCategories.filter(c => c != category))
    } else {
      onChange([...(productCategories ?? []), category])
    }
  }

  const includesCategory = (category) => {
    return productCategories && productCategories.includes(category)
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", width: "100%", gap: 1 }}>
      {categories && categories.map(category => (
        <Chip
          key={category}
          label={category}
          icon={includesCategory(category) ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
          color={includesCategory(category) ? "primary" : "default"}
          onClick={() => handleCategoryChipClick(category)}
          sx={{ cursor: 'pointer' }}
        />
      ))}
    </Box>
  )
}

const ProductEditDialog = ({ open, onClose, product, products, categories, onSave }) => {
  const [editedProduct, setEditedProduct] = useState(product);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setEditedProduct(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }, []);

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

  const isProductNameDublicate = products.some(p => p.name === processProduct(editedProduct).name && p.id != editedProduct.id);
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
            size="small"
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
            size="small"
          />

          <CategoriesList
            productCategories={editedProduct.categories}
            categories={categories}
            onChange={(productCategories) => setEditedProduct({ ...editedProduct, categories: productCategories })}
          />

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
            size="small"
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
            size="small"
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
            size="small"
          />

        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancelButtonClick}>Отмена</Button>
        <Button
          onClick={() => onSave && onSave(processProduct(editedProduct))}
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