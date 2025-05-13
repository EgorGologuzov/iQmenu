import React, { useEffect, useState } from 'react'
import withStackContainerShell from '../../hoc/withStackContainerShell';
import { Alert, Button, CircularProgress, Divider, Stack, TextField } from '@mui/material';
import useTitle from '../../hooks/useTitle';
import ImageInput from '../../components/inputs/ImageInput';
import SwitchInput from '../../components/inputs/SwitchInput';
import CategoriesInput from '../../components/inputs/CategoriesInput';
import ProductsInput from '../../components/inputs/ProductsInput';
import useIQmenuApi from '../../hooks/useIQmenuApi';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router';
import { validateMenu } from '../../data/models/validation';
import QrView from '../../components/controls/QrView';
import { compareMenu } from '../../data/models/comparation';
import useUnsavedChangesWarning from '../../hooks/useUnsavedChangesWarning';
import SaveStatus from '../../components/utils/SaveStatus';

function MenuEdit() {
  const [savedMenu, setSavedMenu] = useState();
  const [menu, setMenu] = useState();
  const [image, setImage] = useState();
  const [categories, setCategories] = useState();
  const [products, setProducts] = useState();
  const [lastError, setLastError] = useState();

  const api = useIQmenuApi();
  const navigate = useNavigate();

  const { menuId } = useParams();

  const buildedMenu = { ...(menu ?? {}), image: image, categories: categories, products: products };
  const { isValid, errors } = validateMenu(buildedMenu);
  const isChanged = !compareMenu(buildedMenu, savedMenu);

  const saveMenu = (menuData) => {
    if (!menuData) return;
    setSavedMenu(menuData);
    setMenu(menuData);
    setImage(menuData.image);
    setCategories(menuData.categories);
    setProducts(menuData.products);
  }

  const { data: loadedMenu, isLoading: isMenuLoading, error: loadingError } = useQuery({
    queryKey: ["api.menu.getById", menuId],
    queryFn: () => api.menu.getById(menuId),
    refetchOnWindowFocus: false,
    refetchOnMount: "always",
    staleTime: 0,
    gcTime: 0,
  })

  const { mutate: updateMenu, isPending: isUpdatePending } = useMutation({
    mutationFn: (menu) => api.menu.update(menu.id, menu.menu),
    mutationKey: ["api.menu.update"],
    onSuccess: (menu) => { saveMenu(menu); setLastError(null); },
    onError: (error) => setLastError(error),
  });

  const { mutate: deleteMenu, isPending: isDeletePending } = useMutation({
    mutationFn: (menu) => api.menu.delete(menu.id),
    mutationKey: ["api.menu.delete"],
    onSuccess: () => navigate("/o/menu?ignoreUnsavedChanges=true", { replace: true }),
    onError: (error) => setLastError(error),
  });

  const handleUpdateButtonClick = () => {
    updateMenu({ id: buildedMenu.id, menu: buildedMenu })
  }

  const handleDeleteButtonClick = () => {
    if (window.confirm("Вы уверенны что хотите удалить меню? Восстановить его будет невозможно!")) {
      deleteMenu(buildedMenu);
    }
  }

  const title = savedMenu ? [savedMenu.companyName, savedMenu.menuName, "Редактирование"].filter(Boolean).join(" / ") : undefined;
  useTitle({ general: title }, [title]);

  useUnsavedChangesWarning(menu && !isChanged);

  useEffect(() => { saveMenu(loadedMenu) }, [loadedMenu]);

  if (loadingError) {
    return <Alert severity="error">{loadingError.message}</Alert>
  }

  if (isMenuLoading || !menu) {
    return <CircularProgress />
  }

  return (
    <Stack direction="column" spacing={2} sx={{ width: "100%", maxWidth: "sm" }}>

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

      {lastError && <Alert severity="error">{lastError.message}</Alert>}

      <Button
        variant="contained"
        loadingPosition="center"
        loading={isUpdatePending}
        onClick={handleUpdateButtonClick}
        disabled={isUpdatePending || isDeletePending || !isValid || !isChanged}
      >
        Сохранить изменения
      </Button>

      <Button
        variant="outlined"
        onClick={() => navigate(-1)}
        disabled={isUpdatePending || isDeletePending}
      >
        Вернуться назад
      </Button>

      <Button
        variant="contained"
        loadingPosition="center"
        color="error"
        loading={isDeletePending}
        onClick={handleDeleteButtonClick}
        disabled={isUpdatePending || isDeletePending}
      >
        Удалить меню
      </Button>

      <Divider />

      <QrView
        src={menu.qr}
        label="QR-код для доступа к меню"
      />

    </Stack>
  )
}

export default withStackContainerShell(MenuEdit)