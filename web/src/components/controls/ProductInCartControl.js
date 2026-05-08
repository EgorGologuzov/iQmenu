import { Box, IconButton, Stack, Typography } from '@mui/material';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { add, remove } from '../../store/slices/cartSlice'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

function ProductInCartControl({ product }) {

  const dispatch = useDispatch();
  const { menuId } = useParams();

  const inCartAmount = useSelector(state => {
    const record = state.cart.find(record => record.menuId == menuId && record.productId == product.id);
    return record && record.amount;
  });

	const onCartButtonClick = () => {
		dispatch(add({ menuId: menuId, productId: product.id }));
	}

	const onMinusClick = () => {
		dispatch(remove({ menuId: menuId, productId: product.id }));
	}

	const onPlusClick = () => {
		dispatch(add({ menuId: menuId, productId: product.id }));
	}

  return (
    <Stack direction="row">
		<IconButton aria-label="Убрать из корзины" color="primary" onClick={onMinusClick} sx={{ px: 0 }}>
			<RemoveIcon />
		</IconButton>
		<Stack direction="column" sx={{ minWidth: "30px", justifyContent: 'center' }}>
			<Typography variant="subtitle1" sx={{ textAlign: 'center' }}>{inCartAmount}</Typography>
		</Stack>
		<IconButton aria-label="Добавить в корзину" color="primary" onClick={onPlusClick} sx={{ px: 0 }}>
			<AddIcon />
		</IconButton>
	</Stack>
  )
}

export default ProductInCartControl