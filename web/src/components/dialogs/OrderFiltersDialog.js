import { Button, Dialog, DialogActions, DialogContent, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { STATUS_TRANSLATION } from '../../values/strings';

function OrderFiltersDialog({ defaultFilters, onClose, onFiltersUpdated, ...otherProps }) {

	const [filters, setFilters] = useState({
		tableNum: defaultFilters.tableNum,
		sendTimeStart: defaultFilters.sendTimeStart,
		sendTimeEnd: defaultFilters.sendTimeEnd,
		status: defaultFilters.status,
		finalAmountMin: defaultFilters.finalAmountMin,
		finalAmountMax: defaultFilters.finalAmountMax,
	});

	const errors = {
		tableNum: filters.tableNum && filters.tableNum.length > 15 ? "Максимальная длина 15 символов" : undefined,
		sendTimeEnd: filters.sendTimeStart && filters.sendTimeEnd && filters.sendTimeStart > filters.sendTimeEnd ? "Конец интервала должен быть позже или равен началу" : undefined,
		finalAmountMax: filters.finalAmountMin && filters.finalAmountMax && filters.finalAmountMin > filters.finalAmountMax ? "Максимальная сумма должна быть больше или равна минимальной" : undefined,
	};

	const hasErrors = !!Object.keys(errors).find(key => !!errors[key]);

	const applyFilters = (filters) => {
		onFiltersUpdated && onFiltersUpdated(filters);
		onClose && onClose();
	}

	const onApplyButtonClick = () => {
		applyFilters(filters);
	}

	const onResetButtonClick = () => {
		const emptyFilters = {};
		Object.keys(filters).forEach(key => emptyFilters[key] = null);
		setFilters(emptyFilters);
		applyFilters(emptyFilters);
	}

	return (
		<Dialog {...otherProps} onClose={onClose} maxWidth="xs" fullWidth>

			<DialogContent sx={{ p: 0 }}>

				<Stack direction="column" spacing={2} sx={{ p: 2 }}>

					<Typography variant="h6">Фильтры</Typography>

					<TextField
						label="Номер столика"
						value={filters.tableNum ?? ''}
						onChange={event => setFilters({ ...filters, tableNum: event.target.value })}
						error={errors.tableNum}
						helperText={errors.tableNum}
						size="small"
					/>

					<TextField
						fullWidth
						label="Мин. дата заказа"
						type="datetime-local"
						value={filters.sendTimeStart}
						onChange={event => setFilters({ ...filters, sendTimeStart: event.target.value })}
						error={errors.sendTimeStart ?? ''}
						helperText={errors.sendTimeStart}
						size="small"
						InputLabelProps={{
							shrink: true,
						}}
					/>

					<TextField
						fullWidth
						label="Макс. дата заказа"
						type="datetime-local"
						value={filters.sendTimeEnd ?? ''}
						onChange={event => setFilters({ ...filters, sendTimeEnd: event.target.value })}
						error={errors.sendTimeEnd}
						helperText={errors.sendTimeEnd}
						size="small"
						InputLabelProps={{
							shrink: true,
						}}
					/>

					<FormControl fullWidth>
						<InputLabel size="small">Статус</InputLabel>
						<Select
							label="Статус"
							size="small"
							value={filters.status ?? ''}
							onChange={event => setFilters({ ...filters, status: event.target.value })}
							error={errors.status}
							helperText={errors.status}
						>
							{Object.keys(STATUS_TRANSLATION).map(key => <MenuItem key={key} value={key}>{STATUS_TRANSLATION[key]}</MenuItem>)}
						</Select>
					</FormControl>

					<TextField
						label="Мин. сумма"
						type="number"
						size="small"
						min={0}
						step={1}
						value={filters.finalAmountMin ?? ''}
						onChange={event => setFilters({ ...filters, finalAmountMin: event.target.value })}
						error={errors.finalAmountMin}
						helperText={errors.finalAmountMin}
						slotProps={{
							inputLabel: {
								shrink: true,
							},
						}}
					/>

					<TextField
						label="Макс. сумма"
						type="number"
						size="small"
						min={0}
						step={1}
						value={filters.finalAmountMax ?? ''}
						onChange={event => setFilters({ ...filters, finalAmountMax: event.target.value })}
						error={errors.finalAmountMax}
						helperText={errors.finalAmountMax}
						slotProps={{
							inputLabel: {
								shrink: true,
							},
						}}
					/>

				</Stack>

			</DialogContent>

			<DialogActions>
				<Button variant="text" onClick={onResetButtonClick}>Сбросить</Button>
				<Button variant="contained" onClick={onApplyButtonClick} disabled={hasErrors}>Применить</Button>
			</DialogActions>

		</Dialog>
	)
}

export default OrderFiltersDialog