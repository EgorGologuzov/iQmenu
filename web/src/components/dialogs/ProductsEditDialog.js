import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import {
  TextField as TextFieldOriginal,
  Stack,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Box,
} from '@mui/material';
import SwitchInputOriginal from '../inputs/SwitchInput';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { validateProduct } from '../../data/models/validation';
import ImageInput from '../inputs/ImageInput';
import { processProduct } from '../../data/models/processing';
import { joinWithApiBaseUrl } from '../../utils/utils';

const TextField = memo(TextFieldOriginal);
const SwitchInput = memo(SwitchInputOriginal);

const CategoriesListItem = memo(({ category, isChecked, actions }) => {
  const handleChipClick = () => actions.onClick(category);
  return (
    <Chip
      key={category}
      label={category}
      icon={isChecked ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
      color={isChecked ? "primary" : "default"}
      onClick={handleChipClick}
      sx={{ cursor: 'pointer' }}
    />
  )
}, (prev, next) => {
  return prev.category == next.category && prev.isChecked == next.isChecked && prev.actions == next.actions;
})

const CategoriesList = memo(({ productCategories, categories, onChange }) => {

  const actions = useMemo(() => ({ onClick: null }), []);

  const isChecked = (category) => {
    return productCategories && productCategories.includes(category);
  }

  const handleCategoryChipClick = (category) => {
    if (isChecked(category)) {
      onChange(productCategories.filter(c => c != category))
    } else {
      onChange([...(productCategories ?? []), category])
    }
  }

  actions.onClick = handleCategoryChipClick;

  return (
    <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", width: "100%", gap: 1 }}>
      {categories && categories.map(category => (
        <CategoriesListItem
          key={category}
          category={category}
          isChecked={isChecked(category)}
          actions={actions}
        />
      ))}
    </Box>
  )
})

const ProductEditDialog = ({ open, onClose, product, products, categories, onSave }) => {
  const [editedProduct, setEditedProduct] = useState(product);
  const [editedProductCategories, setEditedProductCategories] = useState(editedProduct?.categories);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setEditedProduct(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }, []);

  const handleImageChange = useCallback((file) => {
    setEditedProduct(prev => ({ ...prev, image: file }));
  }, [])

  const handleCancelButtonClick = () => {
    setEditedProduct(null);
    onClose && onClose();
  }

  const syncProductAndEditedProduct = () => {
    if (!product) return;

    if (!editedProduct || editedProduct.id != product.id) {
      setEditedProduct(product);
      setEditedProductCategories(product.categories);
    }
  }

  useEffect(() => {
    syncProductAndEditedProduct();
  });

  if (!editedProduct) return;

  const buildedProduct = processProduct({ ...editedProduct, categories: editedProductCategories });
  const { isValid, errors } = validateProduct(buildedProduct);
  const isProductNameDublicate = products.some(p =>
    p.name === buildedProduct.name && p.id != buildedProduct.id
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ pt: 1 }}>

          <ImageInput
            image={typeof editedProduct.image == "string" ? joinWithApiBaseUrl(editedProduct.image) : editedProduct.image}
            onChange={handleImageChange}
          />

          <SwitchInput
            name="isActive"
            label="Есть в наличии"
            checked={editedProduct.isActive ?? true}
            onChange={handleChange}
          />

          <TextField
            name="name"
            label="Название"
            value={editedProduct.name ?? ""}
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
            value={editedProduct.price ?? ""}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            error={errors.price}
            helperText={errors.price}
            size="small"
          />

          <CategoriesList
            productCategories={editedProductCategories}
            categories={categories}
            onChange={setEditedProductCategories}
          />

          <TextField
            name="weight"
            label="Вес (г)"
            type="number"
            value={editedProduct.weight ?? ""}
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
            value={editedProduct.composition ?? ""}
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
            value={editedProduct.description ?? ""}
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
          onClick={() => onSave && onSave(buildedProduct)}
          variant="contained"
          disabled={isProductNameDublicate || !isValid}
        >
          ОК
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductEditDialog