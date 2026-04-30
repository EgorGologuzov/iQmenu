import React, { useState } from 'react'
import { deepCopy, joinWithApiBaseUrl } from '../../utils/utils'
import { MENU_CREATE_TEMPLATE } from '../../values/default'
import withStackContainerShell from '../../hoc/withStackContainerShell';
import { Alert, Button, ButtonGroup, Divider, Stack, TextField, Tooltip } from '@mui/material';
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
import { compareMenu } from '../../data/models/comparation';
import useUnsavedChangesWarning from '../../hooks/useUnsavedChangesWarning';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';

function MenuCreate() {
  const [menu, setMenu] = useState(deepCopy(MENU_CREATE_TEMPLATE));
  const [image, setImage] = useState(menu.image);
  const [categories, setCategories] = useState(menu.categories);
  const [products, setProducts] = useState(menu.products);

  const api = useIQmenuApi();
  const navigate = useNavigate();

  const buildedMenu = processMenu({ ...menu, image: image, categories: categories, products: products });
  const { isValid, errors } = validateMenu(buildedMenu);
  const isChanged = !compareMenu(buildedMenu, MENU_CREATE_TEMPLATE);

  const navigateWithBlocker = useUnsavedChangesWarning(menu && !isChanged);

  const { mutate: createMenu, error: mutationError, isPending: isMutationPending } = useMutation({
    mutationFn: (menuData) => api.menu.create(menuData),
    mutationKey: ["api.menu.create"],
    onSuccess: () => navigateWithBlocker(`/o/menu`, { replace: true, ignoreBlock: true }),
  });

  const onCategoriesChange = (categories) => {
    setCategories(categories);
    setProducts(products.map(p => {
      const actualProductCategories = p.categories.filter(c => categories.includes(c));
      return actualProductCategories.length === p.categories.length ? p : { ...p, categories: actualProductCategories };
    }));
  }

  const onCreateClick = () => {
    if (!isMutationPending) {
      if (!isValid) {
        alert("Форма заполнена с ошибками");
        return;
      }
      createMenu(buildedMenu);
    }
  }

  useTitle({ general: "Новое меню" }, []);

  return (
    <>
      <ButtonGroup sx={{ width: "100%", minHeight: '35px' }}>
        <Tooltip title="Назад">
          <Button
            variant="outlined"
            disabled={isMutationPending}
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{ flexGrow: 1 }}
          />
        </Tooltip>
        <Tooltip title="Создать меню">
          <Button
            variant="contained"
            startIcon={<CheckRoundedIcon />}
            onClick={onCreateClick}
            loading={isMutationPending}
            disabled={isMutationPending}
            sx={{ flexGrow: 1 }}
          />
        </Tooltip>
      </ButtonGroup>

      <Divider />

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
        onChange={onCategoriesChange}
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
        onClick={onCreateClick}
        loading={isMutationPending}
        loadingPosition="center"
        disabled={isMutationPending}>
        Создать меню
      </Button>
    </>
  )
}

export default withStackContainerShell(MenuCreate)