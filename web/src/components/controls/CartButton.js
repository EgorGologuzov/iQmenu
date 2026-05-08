import { Badge, Box, Button, IconButton, Stack, Typography } from '@mui/material';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { add } from '../../store/slices/cartSlice'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

function CartButton({ product, ...otherProps }) {

  const dispatch = useDispatch();
  const { menuId } = useParams();

  const inCartAmount = useSelector(state => {
    const record = state.cart.find(record => record.menuId == menuId && record.productId == product.id);
    return record && record.amount;
  });

	const onClick = () => {
		dispatch(add({ menuId: menuId, productId: product.id }));
	}

  return (
		<IconButton aria-label="Добавить в корзину" color="primary" onClick={onClick} {...otherProps}>
			<Badge
				badgeContent={inCartAmount}
				color="secondary"
				sx={{ height: '14px'}}>
				<ShoppingCartIcon sx={{ width: "22px", height: "22px" }} />
			</Badge>
		</IconButton>
  )
}

export default CartButton