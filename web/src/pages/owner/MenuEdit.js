import React, { useEffect, useState } from 'react'
import withStackContainerShell from '../../hoc/withStackContainerShell';
import { Alert, Button, ButtonGroup, CircularProgress, Divider, Stack, TextField, Tooltip } from '@mui/material';
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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import DeleteIcon from '@mui/icons-material/Delete';

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

  const navigateWithBlocker = useUnsavedChangesWarning(menu && !isChanged);

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
    onSuccess: () => navigateWithBlocker("/o/menu", { replace: true, ignoreBlock: true }),
    onError: (error) => setLastError(error),
  });

  const onCategoriesChange = (categories) => {
    setCategories(categories);
    setProducts(products.map(p => {
      const actualProductCategories = p.categories.filter(c => categories.includes(c));
      return actualProductCategories.length === p.categories.length ? p : { ...p, categories: actualProductCategories };
    }));
  }

  const handleUpdateButtonClick = () => {
    if (!isUpdatePending && !isDeletePending) {
      if (!isValid) {
        alert("Форма заполнена с ошибками");
        return;
      }
      updateMenu({ id: buildedMenu.id, menu: buildedMenu })
    }
  }

  const handleDeleteButtonClick = () => {
    if (window.confirm("Вы уверенны что хотите удалить меню? Восстановить его будет невозможно!")) {
      deleteMenu(buildedMenu);
    }
  }

  const title = savedMenu ? [savedMenu.companyName, savedMenu.menuName, "Редактирование"].filter(Boolean).join(" / ") : undefined;
  useTitle({ general: title }, [title]);

  useEffect(() => { saveMenu(loadedMenu) }, [loadedMenu]);

  if (loadingError) {
    return <Alert severity="error">{loadingError.message}</Alert>
  }

  if (isMenuLoading || !menu) {
    return <CircularProgress disableShrink sx={{ alignSelf: 'center' }} />
  }

  return (
    <>
      <ButtonGroup sx={{ width: "100%" }}>
        <Tooltip title="Назад">
          <Button
            variant="outlined"
            disabled={isUpdatePending || isDeletePending}
            onClick={() => navigate(-1)}
            sx={{ flexGrow: 1 }}
          ><ArrowBackIcon /></Button>
        </Tooltip>
        <Tooltip title="Удалить меню">
          <Button
            variant="contained"
            color="error"
            loading={isDeletePending}
            onClick={handleDeleteButtonClick}
            disabled={isUpdatePending || isDeletePending}
            sx={{ flexGrow: 1 }}
          ><DeleteIcon /></Button>
        </Tooltip>
        <Tooltip title="Создать меню">
          <Button
            variant="contained"
            loading={isUpdatePending}
            onClick={handleUpdateButtonClick}
            disabled={isUpdatePending || isDeletePending || !isChanged}
            sx={{ flexGrow: 1 }}
          ><CheckRoundedIcon /></Button>
        </Tooltip>
      </ButtonGroup>

      <SaveStatus isSaved={!isChanged} />

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

      <SaveStatus isSaved={!isChanged} />

      {lastError && <Alert severity="error">{lastError.message}</Alert>}

      <Button
        variant="contained"
        loadingPosition="center"
        loading={isUpdatePending}
        onClick={handleUpdateButtonClick}
        disabled={isUpdatePending || isDeletePending || !isChanged}>
        Сохранить изменения
      </Button>

      <Divider />

      <QrView
        src={menu.qr}
        label="QR-код для доступа к меню"
      />
    </>
  )
}

export default withStackContainerShell(MenuEdit)