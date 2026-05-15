import { Alert, Button, Card, Dialog, DialogActions, DialogContent, Divider, Stack, TextField, Typography } from '@mui/material'
import React, { memo, useEffect, useMemo, useRef, useState } from 'react'
import UploadIcon from '@mui/icons-material/Upload';
import { useDispatch, useSelector } from 'react-redux';
import ProductInCartControl from '../controls/ProductInCartControl';
import { saveOrder, removeOrder } from '../../store/slices/orderSlice';
import { useParams } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import useIQmenuApi from '../../hooks/useIQmenuApi';
import { getUserAgent } from '../../utils/utils';

const ProductInCardItem = memo(({ product }) => {
	return (
		<Stack direction="row" spacing={1} alignItems="center">
			<Typography variant="body2" sx={{ flexGrow: 1 }}>
				{!product.isActive &&
					<Typography
						component="span"
						sx={{
							backgroundColor: 'error.main',
							color: 'white',
							borderRadius: '1rem',
							px: 0.75,
							mr: 0.5,
							fontSize: '0.75rem',
							display: 'inline-block',
						}}>
						Нет
					</Typography>
				}
				{product.name}
			</Typography>
			<ProductInCartControl product={product} />
		</Stack>
	)
})

function OrderCreateDialog({ products, onClose, ...otherProps }) {

  const dispatch = useDispatch();
	const api = useIQmenuApi();
  const { menuId } = useParams();

  const [tableNum, setTableNum] = useState();
	const [lastError, setLastError] = useState();

  const productsInCart = useSelector(state => state.cart);
  const lastOrder = useSelector(state => state.orders.find(order => order.menuId == menuId));

	const prevCartDisplayProducts = useRef([]);
	const cartDisplayProducts = useMemo(() => {
		const thisMenuProducts = productsInCart.filter(productInCart => productInCart.menuId == menuId);
		const newList = thisMenuProducts
			.map(productInCart => {
				const pastProductItem = prevCartDisplayProducts.current.find(p => p.id == productInCart.productId);
				if (pastProductItem && pastProductItem.amount == productInCart.amount) return pastProductItem;
				let product = products.find(product => productInCart.productId == product.id);
				return product ? { ...product, amount: productInCart.amount} : null;
			})
			.filter(product => !!product);
		prevCartDisplayProducts.current = newList;
		return newList;
	}, [productsInCart, products]);

	const lastOrderDisplayProducts = lastOrder?.products
		? lastOrder.products
				.map(productInCart => {
					let product = products.find(product => productInCart.productId == product.id);
					return product ? { ...product, amount: productInCart.amount} : null;
				})
				.filter(product => !!product)
		: [];

	const productsListToString = (products) => products
		.sort((p1, p2) => p1.id - p2.id)
		.map(p => `${p.id}:${p.amount}`)
		.join(";");

	const cartString = productsListToString(cartDisplayProducts);
	const lastOrderProductsString = productsListToString(lastOrderDisplayProducts);
	const hasChanges = tableNum != lastOrder?.tableNum || cartString != lastOrderProductsString;

	const setOrder = (order) => {
		if (order) {
			dispatch(saveOrder(order));
		} else {
			dispatch(removeOrder({ menuId: menuId }));
		}
	}

	const { mutate: postOrder, isPending: isPostPending } = useMutation({
		mutationFn: (order) => api.order.post(order),
		mutationKey: ["api.order.post"],
		onSuccess: (order) => { setOrder(order); setLastError(null); },
		onError: (error) => setLastError(error),
	});

	const { mutate: patchCancelOrder, isPending: isCancelPending } = useMutation({
		mutationFn: (orderAccessKey) => api.order.cancel(orderAccessKey),
		mutationKey: ["api.order.cancel"],
		onSuccess: () => { setOrder(null); setLastError(null); },
		onError: (error) => setLastError(error),
	});

	const isPending = isPostPending || isCancelPending;

	const errors = {
		tableNum: tableNum && tableNum.length <= 15 ? undefined : "Это обязательное поле, длина от 1 до 15 символов",
		isCartEmpty: !cartDisplayProducts || !cartDisplayProducts.length,
		hasNotActiveProductsInCart: !!cartDisplayProducts.reduce((count, product) => !product.isActive ? count + 1 : count, 0),
	}

  const sendOrder = () => {
    if (errors.tableNum) {
			setLastError(new Error("Укажите корректный номер столика"));
      return;
    }
    if (errors.isCartEmpty) {
			setLastError(new Error("Нет продуктов в корзине, добавьте хотябы один продукт, чтобы сделать заказ"));
      return;
    }
		if (errors.hasNotActiveProductsInCart) {
			setLastError(new Error("В корзине есть продукты, которые временно не доступны для заказа, уберите их, чтобы сделать заказ"));
			return;
		}

		setLastError(null);

		const buildedOrder = {
			menuId: menuId, 
			tableNum: tableNum, 
			products: cartDisplayProducts.map(p => { return { productId: p.id, amount: p.amount } }),
			prevAccessKey: lastOrder ? lastOrder.accessKey : undefined,
			userAgent: getUserAgent(),
		}

		postOrder(buildedOrder);
  }

	const cancelCurrentOrder = () => {
		if (isPending || !lastOrder) return;
		if (window.confirm("Хотите отменить заказ?")) {
			patchCancelOrder(lastOrder.accessKey);
		}
	}

  const closeDialog = () => {
    onClose && onClose();
  }

	const formatTime = (date) => {
		date = new Date(date);
		return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
	}

  return (
    <Dialog {...otherProps} onClose={onClose} maxWidth="xs" fullWidth>

      <DialogContent sx={{ p: 0 }}>

        <Stack direction="column" spacing={2} sx={{ p: 2, pb: 0 }}>

					{lastError && !isPending && <Alert severity="error">{lastError.message}</Alert>}

					{lastOrder &&
						<Alert severity="success" onClick={cancelCurrentOrder} sx={{ cursor: "pointer" }}>
							<b>Ваш заказ (№{lastOrder.id}) был сделан в {formatTime(lastOrder.sendTime)} к столику {lastOrder.tableNum}:</b> <br/>
							{lastOrder.products && lastOrderDisplayProducts.map(product => 
								<React.Fragment key={product.id}>&#10004; {product.name} ({product.amount} {product.amount % 10 >= 2 && product.amount % 10 <= 4 ? "раза" : "раз"})<br/></React.Fragment>
							)}
						</Alert>
					}

					{lastOrder && <Divider />}

          <TextField
            id="tableNum"
            label="Номер столика"
            required
            value={tableNum ?? ""}
            onChange={event => setTableNum(event.target.value)}
            error={errors.tableNum}
            helperText={errors.tableNum}
            size="small"
          />

          <Stack direction="column" spacing={0.5}>
						{!cartDisplayProducts?.length && <Alert severity="info">Корзина пуста</Alert>}
            {cartDisplayProducts?.length != 0 && cartDisplayProducts.map(product => <ProductInCardItem key={product.id} product={product} />)}
          </Stack>

					<Divider />

					{cartDisplayProducts?.length != 0 &&
						<Stack direction="row" alignItems="center" justifyContent="space-between">
							<Typography variant="button">Итого:</Typography>
							<Typography variant="button">
								{cartDisplayProducts.reduce((sum, product) => sum + product.price * product.amount, 0)}₽
							</Typography>
						</Stack>
					}

        </Stack>

      </DialogContent>

      <DialogActions>
        <Button variant="text" onClick={closeDialog}>Закрыть</Button>
        <Button
					variant="contained"
					loading={isPending}
					startIcon={<UploadIcon />}
					disabled={isPending || !hasChanges}
					onClick={sendOrder}>
					{lastOrder ? "Обновить" : "Заказать"}
        </Button>
      </DialogActions>

    </Dialog>
  )
}

export default OrderCreateDialog