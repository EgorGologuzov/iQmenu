import React, { useState } from 'react'
import { deepCopy } from '../../utils/utils'
import { MENU_CREATE_TEMPLATE } from '../../values/default'
import { useDispatch, useSelector } from 'react-redux';
import usePageDataInitialValue from '../../hooks/usePageDataInitialValue'
import withStackContainerShell from '../../hoc/withStackContainerShell';
import { CircularProgress, Stack, TextField, Typography } from '@mui/material';
import { setPageData } from '../../store/slices/pageSlice';
import useTitle from '../../hooks/useTitle';
import ImageInput from '../../components/inputs/ImageInput';
import SwitchInput from '../../components/inputs/SwitchInput';
import CategoriesInput from '../../components/inputs/CategoriesInput';
import ProductsInput from '../../components/inputs/ProductsInput';

function MenuCreate() {

  const menu = useSelector(state => state.page.data);
  const dispatch = useDispatch();

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
      />

      <TextField
        id="menuName"
        label="Название меню"
        required
        value={menu.menuName ?? ""}
        onChange={(event) => setMenuAttrs({ menuName: event.target.value })}
      />

      <Typography component="div" variant="subtitle1">
        Главное изображение меню:
      </Typography>

      <ImageInput
        src={menu.image}
        onChange={file => setMenuAttrs({ image: file })}
      />

      <Typography component="div" variant="subtitle1">
        Категории:
      </Typography>

      <CategoriesInput
        categories={menu.categories}
        onChange={categories => setMenuAttrs({ categories: categories })}
      />

      <Typography component="div" variant="subtitle1">
        Продукты:
      </Typography>

      {/* <ProductsInput
        products={menu.products}
        onChange={products => setMenuAttrs({ products: products })}
      /> */}

      <ProductsInput
        products={menu.products}
        categories={menu.categories}
        onChange={(products) => setMenuAttrs({ products: products })}
      />

      <Typography component="div" variant="body1">
        {JSON.stringify(menu, null, " ")}
      </Typography>

    </Stack>
  )
}

export default withStackContainerShell(MenuCreate)