import { Alert, Button, Dialog, DialogActions, DialogContent, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { PERIOD_TRANSLATION, REPORT_FORMAT_TRANSLATION, STATISTIC_REPORT_TRANSLATION } from '../../values/strings';
import { useMutation } from '@tanstack/react-query';
import useIQmenuApi from '../../hooks/useIQmenuApi';
import { parseDeviceInfo } from '../../utils/utils';

const PERIOD_LENGTH_DAYS = {
	[PERIOD_TRANSLATION.oneDay]: 1,
	[PERIOD_TRANSLATION.oneWeek]: 7,
	[PERIOD_TRANSLATION.oneMonth]: 30,
	[PERIOD_TRANSLATION.oneYear]: 365,
}

function DownloadStatisticDialog({ menu, onClose, ...otherProps }) {

	const api = useIQmenuApi();

	const [report, setReport] = useState();
	const [format, setFormat] = useState(REPORT_FORMAT_TRANSLATION.csv);
	const [period, setPeriod] = useState(PERIOD_TRANSLATION.oneWeek);

	const [lastError, setLastError] = useState();
	const [isLoading, setIsLoading] = useState(false);

	const errors = {
		report: !report ? "Выберите отчет, который хотите скачать" : undefined,
	};

	const hasErrors = !!Object.keys(errors).find(key => !!errors[key]);

	const saveToFile = (content, fileName, contentType) => {
		const blob = new Blob([content], { type: contentType });
		const url = URL.createObjectURL(blob);

		const link = document.createElement('a');
		link.href = url;
		link.download = fileName;

		document.body.appendChild(link);
		link.click();

		// Очистка памяти
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	};

	const saveAsJson = (listData) => {
		const jsonString = JSON.stringify(listData, null, 2);
		saveToFile(jsonString, 'online_menu_stat.json', 'application/json;charset=utf-8');
	};

	const saveAsCsv = (listData) => {
		const separator = ';';

		const headers = Object.keys(listData[0]);
		const csvContent = [headers.join(separator)];

		// Формируем строки данных
		const csvRows = listData.forEach(row =>
			csvContent.push(headers.map(headerId => {
				let value = row[headerId] ?? '';
				return typeof value === 'object' ? JSON.stringify(value) : String(value);
			}).join(separator)
		));

		// Добавляем \uFEFF (BOM) для корректного отображения кириллицы в Excel
		const finalContent = '\uFEFF' + csvContent.join('\n');

		saveToFile(finalContent, 'online_menu_stat.csv', 'text/csv;charset=utf-8');
	};

	const sendReportRequest = () => {
		setIsLoading(true);
		const params = { menuId: menu.id, lastDays: PERIOD_LENGTH_DAYS[period] };
		if (report == STATISTIC_REPORT_TRANSLATION.viewsStatistic) {
			return api.statistic.getViewsStatistic(params);
		} else {
			return api.statistic.getOrdersDownload(params);
		}
	}

	const processViewsStatistic = (reportData) => {
		const reportList = reportData.events;
		if (!reportList || !reportList.length) {
			return { error: "Отчет пуст. Нет ни одного просмотра за указанный период для этого меню." };
		}

		const outputList = reportList.map(event => {
			const device = parseDeviceInfo(event.userAgent);
			return {
				event: event.event,
				sendTime: event.sendTime,
				productName: event.productName,
				deviceType: device.type,
				device: device.device,
				os: device.os,
				browser: device.browser,
			}
		});

		return { outputList };
	}

	const processOrdersDownload = (reportData) => {
		const reportList = reportData.orders;
		if (!reportList || !reportList.length) {
			return { error: "Отчет пуст. Нет ни одного заказа за указанный период для этого меню." };
		}

		const outputList = reportList.map(order => {
			const device = parseDeviceInfo(order.userAgent);
			const products = order.products;
			delete order.menuId;
			delete order.accessKey;
			delete order.userAgent;
			delete order.products;
			return {
				...order,
				products: products.map(product => `${product.productName} (x${product.amount})`).join(", "),
				deviceType: device.type,
				device: device.device,
				os: device.os,
				browser: device.browser,
			}
		});

		return { outputList };
	}

	const handleRequestSuccess = (reportData) => {
		setLastError(null);

		let processedData = null;
		if (report == STATISTIC_REPORT_TRANSLATION.viewsStatistic) {
			processedData = processViewsStatistic(reportData);
		} else {
			processedData = processOrdersDownload(reportData);
		}

		const { outputList, error } = processedData;
		if (!outputList || !outputList.length || error) {
			setLastError(new Error(error));
			setIsLoading(false);
			return;
		}

		if (format === REPORT_FORMAT_TRANSLATION.csv) {
			saveAsCsv(outputList);
		} else {
			saveAsJson(outputList);
		}

		setIsLoading(false);
	}

	const handleRequestError = (error) => {
		setLastError(error);
		setIsLoading(false);
	}

	const {
		mutate: fetchViewsStatistic,
	} = useMutation({
		mutationFn: sendReportRequest,
		onSuccess: handleRequestSuccess,
		onError: handleRequestError,
	})

	return (
		<Dialog {...otherProps} onClose={onClose} maxWidth="xs" fullWidth>

			<DialogContent sx={{ p: 0 }}>

				<Stack direction="column" spacing={2} sx={{ p: 2 }}>

					<Stack direction="column" spacing={1}>
						<Typography variant="h6">Статистика</Typography>
						<Typography variant="subtitle1">{`${menu.menuName} / ${menu.companyName}`}</Typography>
					</Stack>

					<FormControl fullWidth>
						<InputLabel size="small">Отчет</InputLabel>
						<Select
							label="Отчет"
							size="small"
							disabled={isLoading}
							value={report ?? ''}
							onChange={e => setReport(e.target.value)}
							error={errors.report}
						>
							{Object.keys(STATISTIC_REPORT_TRANSLATION).map(key => <MenuItem key={key} value={STATISTIC_REPORT_TRANSLATION[key]}>{STATISTIC_REPORT_TRANSLATION[key]}</MenuItem>)}
						</Select>
					</FormControl>

					<FormControl fullWidth>
						<InputLabel size="small">Формат</InputLabel>
						<Select
							label="Формат"
							size="small"
							disabled={isLoading}
							value={format ?? ''}
							onChange={e => setFormat(e.target.value)}
							error={errors.format}
						>
							{Object.keys(REPORT_FORMAT_TRANSLATION).map(key => <MenuItem key={key} value={REPORT_FORMAT_TRANSLATION[key]}>{REPORT_FORMAT_TRANSLATION[key]}</MenuItem>)}
						</Select>
					</FormControl>

					<FormControl fullWidth>
						<InputLabel size="small">Период</InputLabel>
						<Select
							label="Период"
							size="small"
							disabled={isLoading}
							value={period ?? ''}
							onChange={e => setPeriod(e.target.value)}
							error={errors.period}
						>
							{Object.keys(PERIOD_TRANSLATION).map(key => <MenuItem key={key} value={PERIOD_TRANSLATION[key]}>{PERIOD_TRANSLATION[key]}</MenuItem>)}
						</Select>
					</FormControl>

					{isLoading && <Alert severity="warning">Формирование и загрузка отчета может занять время. Подождите пожалуйста.</Alert>}
					{lastError && !isLoading && <Alert severity="error">{lastError.message}</Alert>}

				</Stack>

			</DialogContent>

			<DialogActions>
				<Button variant="text" onClick={onClose}>Закрыть</Button>
				<Button variant="contained" onClick={fetchViewsStatistic} disabled={hasErrors} loading={isLoading}>Скачать</Button>
			</DialogActions>

		</Dialog>
	)
}

export default DownloadStatisticDialog