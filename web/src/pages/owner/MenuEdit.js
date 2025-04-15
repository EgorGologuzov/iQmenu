import React, { useCallback, useMemo, useState } from 'react'
import { deepCopy } from '../../utils/utils'
import { MENU_CREATE_TEMPLATE } from '../../values/default'
import withStackContainerShell from '../../hoc/withStackContainerShell';
import { Alert, Button, CircularProgress, Divider, Stack, TextField, Typography } from '@mui/material';
import useTitle from '../../hooks/useTitle';
import ImageInput from '../../components/inputs/ImageInput';
import SwitchInput from '../../components/inputs/SwitchInput';
import CategoriesInput from '../../components/inputs/CategoriesInput';
import ProductsInput from '../../components/inputs/ProductsInput';
import useIQmenuApi from '../../hooks/useIQmenuApi';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router';
import { validateMenu } from '../../data/models/validation';
import { processMenu } from '../../data/models/processing';
import QrView from '../../components/controls/QrView';

const SaveStatus = ({ isSaved }) => {
  return isSaved
  ? <Alert severity="success">Изменения сохранены</Alert>
  : <Alert severity="warning">Не забудьте сохранить изменения</Alert>
}

function MenuEdit() {
  const [menu, setMenu] = useState(null);
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState(null);
  const [products, setProducts] = useState(null);

  const api = useIQmenuApi();
  const navigate = useNavigate();

  const { menuId } = useParams();

  const { data: loadedMenu, isLoading: isQueryLoading, error: queryError } = useQuery({
    queryKey: ["MenuEdit/api.menu.getById"],
    queryFn: () => api.menu.getById(menuId),
  })

  const { mutate: updateMenu, data: updatededMenu, error: mutationError, isPending: isMutationPending } = useMutation({
    mutationFn: (data) => api.menu.update(data.id, data.menu),
    mutationKey: ["MenuEdit/api.menu.update"],
  });

  const title = loadedMenu ? [loadedMenu.companyName, loadedMenu.menuName, "Редактирование"].filter(Boolean).join(" / ") : undefined;
  useTitle({ general: title }, [title]);

  if (isQueryLoading) {
    return <CircularProgress />
  }

  if (queryError) {
    return <Alert severity="error">{queryError.message}</Alert>
  }

  if (!loadedMenu) {
    return <Alert severity="info">Меню не найдено...</Alert>
  }

  if (!menu) {
    setMenu(loadedMenu);
    setImage(loadedMenu.image);
    setCategories(loadedMenu.categories);
    setProducts(loadedMenu.products);
    return <CircularProgress />
  }

  const buildedMenu = processMenu({ ...menu, image: image, categories: categories, products: products });
  const { isValid, errors } = validateMenu(buildedMenu);
  const buildedMenuJson = JSON.stringify(buildedMenu);
  const loadedMenuJson = JSON.stringify(loadedMenu);
  const updatededMenuJson = JSON.stringify(updatededMenu);
  const isChanged = buildedMenuJson !== loadedMenuJson && buildedMenuJson !== updatededMenuJson;

  return (
    <Stack direction="column" spacing={2} width="100%" maxWidth={500}>

      <SaveStatus isSaved={!isChanged} />

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

      <SaveStatus isSaved={!isChanged} />

      {mutationError && <Alert severity="error">{mutationError.message}</Alert>}

      <Button
        variant="contained"
        loading={isMutationPending}
        loadingPosition="center"
        onClick={() => updateMenu({ id: buildedMenu.id, menu: buildedMenu })}
        disabled={isMutationPending || !isValid || !isChanged}
      >
        Сохранить изменения
      </Button>

      <Button
        variant="outlined"
        onClick={() => navigate(-1)}
        disabled={isMutationPending}
      >
        Вернуться назад
      </Button>

      <Divider />

      <QrView
        src={loadedMenu.qr}
        label="QR-код для доступа к меню"
      />

    </Stack>
  )
}

export default withStackContainerShell(MenuEdit)