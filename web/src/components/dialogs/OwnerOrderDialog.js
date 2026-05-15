import { Alert, Button, Chip, Dialog, DialogActions, DialogContent, FormControl, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import useIQmenuApi from '../../hooks/useIQmenuApi';
import { ORDER_SELECTOR_TRANSLATION, STATUS_TRANSLATION } from '../../values/strings';
import { useMutation } from '@tanstack/react-query';
import { isPending } from '@reduxjs/toolkit';
import { formatRelativeTime, formatTime, parseDeviceInfo } from '../../utils/utils';

const DEFAULT_QUERY = { ordersSelector: ORDER_SELECTOR_TRANSLATION.onlyThis };

function OwnerOrderDialog({ order, checkedOrdersIds, filters, onClose, onOrdersUpdated, ...otherProps }) {

	const api = useIQmenuApi();

	const [query, setQuery] = useState({ ...DEFAULT_QUERY });
	const [lastError, setLastError] = useState();

	const sendStatusUpdateRequest = () => {
		if (query.ordersSelector === ORDER_SELECTOR_TRANSLATION.onlyThis) {
			return api.order.updateOrdersStatusByIds({ ids: [order.id], newStatus: query.newStatus });
		}
		else if (query.ordersSelector === ORDER_SELECTOR_TRANSLATION.allChecked) {
			return api.order.updateOrdersStatusByIds({ ids: checkedOrdersIds, newStatus: query.newStatus });
		}
		else if (query.ordersSelector === ORDER_SELECTOR_TRANSLATION.allFiltered) {
			return api.order.updateOrdersStatusByFilters({ ...filters, newStatus: query.newStatus  });
		}
	}

	const closeDialog = () => {
		if (onClose) {
			setQuery({ ...DEFAULT_QUERY });
			setLastError(null);
			onClose();
		}
	}

	const onSuccessUpdateStatuses = (result) => {
		onOrdersUpdated && onOrdersUpdated();
		closeDialog();
		alert(`Обновлено заказов: ${result.modifiedCount}`);
	}

	const { mutate: updateStatuses, isPending } = useMutation({
		mutationFn: sendStatusUpdateRequest,
		mutationKey: ["sendStatusUpdateRequest"],
		onSuccess: onSuccessUpdateStatuses,
		onError: (error) => setLastError(error),
	});

	const errors = {
		newStatus: !query.newStatus,
		ordersSelector: !query.ordersSelector,
		choosenAllCheckedSelectorButCheckedOrdersIdsIsEmpty: query.ordersSelector === ORDER_SELECTOR_TRANSLATION.allChecked && (!checkedOrdersIds || !checkedOrdersIds.length),
	}

	const clientInfo = parseDeviceInfo(order.userAgent)?.stringInfo;

	const onUpdateStatusButtonClick = () => {
		if (errors.newStatus) {
			setLastError(new Error("Укажите новый статус"));
			return;
		}
		if (errors.ordersSelector) {
			setLastError(new Error("Укажите, каким заказам "));
			return;
		}
		if (errors.choosenAllCheckedSelectorButCheckedOrdersIdsIsEmpty) {
			setLastError(new Error("Не выбран ни один заказ, отметьте ✔ заказы, чтобы обновить статус всем выбранным"));
			return;
		}

		setLastError(null);
		updateStatuses();
	}

	return (
		<Dialog {...otherProps} onClose={closeDialog} maxWidth="xs" fullWidth>

			<DialogContent sx={{ p: 0 }}>
				<Stack direction="column" spacing={1} sx={{ p: 2, pb: 0 }}>

					<Typography variant="h6">
						{`Заказ №${order.id}`}
						<Chip
							label={STATUS_TRANSLATION[order.status]}
							size="small"
							color={({ new: "success", executing: "warning" })[order.status] ?? "primary.light"}
							sx={{ ml: 1 }}
						/>
					</Typography>

					<Typography variant="caption">
						{`${formatRelativeTime(order.sendTime)} (${formatTime(order.sendTime)})` + (clientInfo ? `, ${clientInfo}` : '')}
					</Typography>

					<Typography variant="body1">
						Столик: <b>{order.tableNum}</b>
					</Typography>

					<Typography variant="body1">
						<b>Список продуктов:</b><br/>
						{order.products.map(product => 
							<React.Fragment key={product.productId}>&#10004; {product.productName} ({product.amount} {product.amount % 10 >= 2 && product.amount % 10 <= 4 ? "раза" : "раз"})<br/></React.Fragment>
						)}
					</Typography>

					<Stack direction="column" spacing={2}>

						<Stack direction="row" alignItems="center" justifyContent="space-between">
							<Typography variant="button">Итого:</Typography>
							<Typography variant="button">
								{order.finalAmount}₽
							</Typography>
						</Stack>

						<FormControl fullWidth>
							<InputLabel size="small">Новый статус</InputLabel>
							<Select
								label="Новый статус"
								size="small"
								value={query.newStatus ?? ''}
								onChange={(e) => setQuery({ ...query, newStatus: e.target.value })}
								error={errors.newStatus}
							>
								{Object.keys(STATUS_TRANSLATION).map(key => <MenuItem key={key} value={key}>{STATUS_TRANSLATION[key]}</MenuItem>)}
							</Select>
						</FormControl>

						<FormControl fullWidth>
							<InputLabel size="small">Для заказов</InputLabel>
							<Select
								label="Для заказов"
								size="small"
								value={query.ordersSelector ?? ''}
								onChange={(e) => setQuery({ ...query, ordersSelector: e.target.value })}
								error={errors.ordersSelector}
							>
								{Object.keys(ORDER_SELECTOR_TRANSLATION).map(key => <MenuItem key={key} value={ORDER_SELECTOR_TRANSLATION[key]}>{ORDER_SELECTOR_TRANSLATION[key]}</MenuItem>)}
							</Select>
						</FormControl>

						<Button
							variant="contained"
							color="error"
							loading={isPending}
							disabled={isPending}
							onClick={onUpdateStatusButtonClick}>
							Обновить статус
						</Button>

						{lastError && <Alert severity="error">{lastError.message}</Alert>}

					</Stack>

				</Stack>
			</DialogContent>

			<DialogActions>
				<Button variant="text" onClick={closeDialog}>Закрыть</Button>
			</DialogActions>

		</Dialog>
	)
}

export default OwnerOrderDialog