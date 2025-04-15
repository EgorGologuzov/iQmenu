import React, { useCallback, useMemo, useState } from 'react'
import { deepCopy } from '../../utils/utils'
import { MENU_CREATE_TEMPLATE } from '../../values/default'
import withStackContainerShell from '../../hoc/withStackContainerShell';
import { Alert, Button, Divider, Stack, TextField, Typography } from '@mui/material';
import useTitle from '../../hooks/useTitle';
import ImageInput from '../../components/inputs/ImageInput';
import SwitchInput from '../../components/inputs/SwitchInput';
import CategoriesInput from '../../components/inputs/CategoriesInput';
import ProductsInput from '../../components/inputs/ProductsInput';
import useIQmenuApi from '../../hooks/useIQmenuApi';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { validateMenu } from '../../data/models/validation';
import { processMenu } from '../../data/models/processing';

function MenuCreate() {
  const [menu, setMenu] = useState(deepCopy(MENU_CREATE_TEMPLATE));
  const [image, setImage] = useState({ data: menu.image });
  const [categories, setCategories] = useState(menu.categories);
  const [products, setProducts] = useState(menu.products);

  const api = useIQmenuApi();
  const navigate = useNavigate();

  const { mutate: createMenu, error: mutationError, isPending: isMutationPending } = useMutation({
    mutationFn: (menuData) => api.menu.create(menuData),
    mutationKey: ["MenuCreate/api.menu.create"],
    onSuccess: () => navigate(`/o/menu`, { replace: true })
  });

  const buildedMenu = processMenu({ ...menu, image: image, categories: categories, products: products });

  const { isValid, errors } = validateMenu(buildedMenu);

  useTitle({ general: "Новое меню" }, []);

  return (
    <Stack direction="column" spacing={2} width="100%" maxWidth={500}>

      <SwitchInput
        id="isActive"
        label="Опубликовать:"
        checked={menu.isActive}
        onChange={event => setMenu({ ...menu, isActive: event.target.checked })}
      />

      <TextField
        id="companyName"
        label="Название заведения"
        required
        value={menu.companyName ?? ""}
        onChange={event => setMenu({ ...menu, companyName: event.target.value })}
        error={errors.companyName}
        helperText={errors.companyName}
        size="small"
      />

      <TextField
        id="menuName"
        label="Название меню"
        required
        value={menu.menuName ?? ""}
        onChange={event => setMenu({ ...menu, menuName: event.target.value })}
        error={errors.menuName}
        helperText={errors.menuName}
        size="small"
      />

      <ImageInput
        image={image}
        onChange={setImage}
        label="Главное изображение меню"
        error={errors.image}
        helperText={errors.image}
      />

      <CategoriesInput
        categories={categories}
        onChange={setCategories}
        label="Категории"
        error={errors.categories}
        helperText={errors.categories}
      />

      <ProductsInput
        products={products}
        categories={categories}
        onChange={setProducts}
        label="Продукты"
        error={errors.products}
        helperText={errors.products}
      />

      <Divider />

      {mutationError && <Alert severity="error">{mutationError.message}</Alert>}

      <Button
        variant="contained"
        onClick={() => createMenu(buildedMenu)}
        loading={isMutationPending}
        loadingPosition="center"
        disabled={isMutationPending || !isValid}
      >
        Создать меню
      </Button>

      <Button
        variant="outlined"
        onClick={() => navigate(-1)}
        disabled={isMutationPending}
      >
        Вернуться назад
      </Button>

    </Stack>
  )
}

export default withStackContainerShell(MenuCreate)