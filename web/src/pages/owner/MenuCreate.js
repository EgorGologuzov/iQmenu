import React, { useState } from 'react'
import { deepCopy } from '../../utils/utils'
import { MENU_CREATE_TEMPLATE } from '../../values/default'
import { useDispatch, useSelector } from 'react-redux';
import usePageDataInitialValue from '../../hooks/usePageDataInitialValue'
import withStackContainerShell from '../../hoc/withStackContainerShell';
import { Alert, Box, Button, CircularProgress, Divider, Stack, TextField, Typography } from '@mui/material';
import { setPageData } from '../../store/slices/pageSlice';
import useTitle from '../../hooks/useTitle';
import ImageInput from '../../components/inputs/ImageInput';
import SwitchInput from '../../components/inputs/SwitchInput';
import CategoriesInput from '../../components/inputs/CategoriesInput';
import ProductsInput from '../../components/inputs/ProductsInput';
import useIQmenuApi from '../../hooks/useIQmenuApi';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { validateMenu } from '../../data/models/validation';

function MenuCreate() {

  const menu = useSelector(state => state.page.data);
  const dispatch = useDispatch();

  const api = useIQmenuApi();
  const navigate = useNavigate();

  const { isValid, errors } = validateMenu(menu);

  const { mutate: createMenu, error: isMutationError, isPending: isMutationPending } = useMutation({
    mutationFn: (menuData) => api.menu.create(menuData),
    mutationKey: ["menu"],
    onSuccess: (createdMenu) => navigate(`/o/menu/${createdMenu.id}/edit`, { replace: true })
  });

  const setMenuAttrs = (newAttrs) => {
    dispatch(setPageData({ ...menu, ...newAttrs }));
  }

  useTitle({ general: "Новое меню" }, []);

  usePageDataInitialValue(deepCopy(MENU_CREATE_TEMPLATE));

  if (!menu || menu.isActive === undefined) {
    return <CircularProgress />;
  }

  return (
    <Stack direction="column" spacing={2} width="100%" maxWidth={500}>

      <SwitchInput
        id="isActive"
        label="Опубликовать:"
        checked={menu.isActive}
        onChange={(event) => setMenuAttrs({ isActive: event.target.checked })}
      />

      <TextField
        id="companyName"
        label="Название заведения"
        required
        value={menu.companyName ?? ""}
        onChange={(event) => setMenuAttrs({ companyName: event.target.value })}
        error={errors.companyName}
        helperText={errors.companyName}
      />

      <TextField
        id="menuName"
        label="Название меню"
        required
        value={menu.menuName ?? ""}
        onChange={(event) => setMenuAttrs({ menuName: event.target.value })}
        error={errors.menuName}
        helperText={errors.menuName}
      />

      <ImageInput
        image={menu.image}
        onChange={file => setMenuAttrs({ image: file })}
        label="Главное изображение меню"
        error={errors.image}
        helperText={errors.image}
      />

      <CategoriesInput
        categories={menu.categories}
        onChange={categories => setMenuAttrs({ categories: categories })}
        label="Категории"
        error={errors.categories}
        helperText={errors.categories}
      />

      <ProductsInput
        products={menu.products}
        categories={menu.categories}
        onChange={(products) => setMenuAttrs({ products: products })}
        label="Продукты"
        error={errors.products}
        helperText={errors.products}
      />

      {/* {createdMenu && (
        <>
          <Alert severity="success">Меню успешно создано</Alert>
          <Box
            component="img"
            sx={{ width: "100%", aspectRatio: "1 / 1", objectFit: "cover", borderRadius: 2 }}
            src={createdMenu.qr}
            alt="QR-код для меню"
          />
          <Button variant="contained">
            Копировать QR-код
          </Button>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Назад
          </Button>
        </>
      )} */}

    <Divider />

      {isMutationError && <Alert severity="error">{isMutationError.message}</Alert>}

      <Button
        variant="contained"
        onClick={() => createMenu(menu)}
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

      <Typography component="div" variant="body1">
        {JSON.stringify(menu, null, " ")}
      </Typography>

    </Stack>
  )
}

export default withStackContainerShell(MenuCreate)