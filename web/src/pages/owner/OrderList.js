import React, { useEffect, useRef, useState } from 'react'
import OwnerNavBar from '../../components/navs/OwnerNavBar';
import withStackContainerShell from '../../hoc/withStackContainerShell';
import useTitle from '../../hooks/useTitle';
import useIQmenuApi from '../../hooks/useIQmenuApi';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { Alert, Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent, Divider, FormControl, IconButton, InputLabel, MenuItem, Pagination, Select, Stack, Typography } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ORDER_SELECTOR_TRANSLATION, STATUS_TRANSLATION } from '../../values/strings';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

function OrderList() {

  const MAX_PRODUCTS_ITEMS_IN_ORDER_CARD = 5;

  const [fetchQuery, setFetchQuery] = useState({ page: 1 });
  const [updateStatusQuery, setUpdateStatusQuery] = useState({});
  const [checkedOrders, setCheckedOrders] = useState([]);

  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [dialogOrder, setDialogOrder] = useState();
  const [orderDialogLastError, setOrderDialogLastError] = useState();

  const api = useIQmenuApi();
  const userId = useSelector(state => state.user.id);
  const navigate = useNavigate();

  const { data: allMenus, isLoading: isMenusLoading, error: menusError } = useQuery({
    queryKey: [`api.menu.getUsersMenus`, userId],
    queryFn: () => api.menu.getUsersMenus(userId),
    refetchOnWindowFocus: false,
  })

  const { data: ordersData, isLoading: isOrdersLoading, error: ordersError } = useQuery({
    queryKey: [`api.order.getOrders`, fetchQuery],
    queryFn: () => api.order.getOrders(fetchQuery),
    refetchOnWindowFocus: false,
    enabled: !!fetchQuery.page && !!fetchQuery.menuId,
  })

  const sendStatusUpdateRequest = () => {
    if (updateStatusQuery.ordersSelector === ORDER_SELECTOR_TRANSLATION.onlyThis) {
      return api.order.updateOrdersStatusByIds({ ids: [dialogOrder.id], newStatus: updateStatusQuery.newStatus });
    }
    else if (updateStatusQuery.ordersSelector === ORDER_SELECTOR_TRANSLATION.allChecked) {
      return api.order.updateOrdersStatusByIds({ ids: checkedOrders, newStatus: updateStatusQuery.newStatus });
    }
    else if (updateStatusQuery.ordersSelector === ORDER_SELECTOR_TRANSLATION.allFiltered) {
      return api.order.updateOrdersStatusByFilters({ ...fetchQuery, newStatus: updateStatusQuery.newStatus  });
    }
  }

  const { mutate: updateStatuses, isPending: isUpdatePending } = useMutation({
    mutationFn: () => sendStatusUpdateRequest(),
    mutationKey: ["api.order.status.update"],
    onSuccess: (result) => { setOrderDialogLastError(null); alert(`Количество обновленных заказов: ${result.modifiedCount}`); },
    onError: (error) => setOrderDialogLastError(error),
  });

  const isLoading = isMenusLoading || isOrdersLoading;
  const lastError = ordersError || menusError;
  const orders = ordersData?.orders;
  const pagesCount = ordersData?.pagesCount;

  const formatTime = (date) => {
		date = new Date(date);
		return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
	}

  const onCheckOrderClick = (orderId) => {
    if (checkedOrders.includes(orderId)) {
      setCheckedOrders(checkedOrders.filter(id => id !== orderId));
    } else {
      setCheckedOrders([...checkedOrders, orderId]);
    }
  };

  const openOrder = (order) => {
    setDialogOrder(order);
    setIsOrderDialogOpen(true);
  }

  const onUpdateStatusClick = () => {
    if (!updateStatusQuery.newStatus) {
      alert("Укажите новый статус");
      return;
    }
    if (!updateStatusQuery.ordersSelector) {
      alert("Укажите, к каким заказам применить новый статус");
      return;
    }
    updateStatuses();
  }

	useTitle({ general: "Заказы по вашим меню" }, []);

  useEffect(() => setCheckedOrders([]), [ordersData])

  return (
    <>
			<OwnerNavBar />

      {lastError && <Alert severity="error">{lastError.message}</Alert>}

      <FormControl fullWidth>
        <InputLabel size="small">Меню</InputLabel>
        <Select
          label="Меню"
          size="small"
          value={fetchQuery.menuId ?? ''}
          onChange={(e) => setFetchQuery({ ...fetchQuery, menuId: e.target.value })}
        >
          {allMenus && allMenus.map(menu => <MenuItem key={menu.id} value={menu.id}>{`${menu.menuName} / ${menu.companyName}`}</MenuItem>)}
        </Select>
      </FormControl>

      {isLoading && <CircularProgress disableShrink sx={{ alignSelf: 'center' }} />}

      {!isLoading && pagesCount && pagesCount > 1 && <Pagination 
        count={pagesCount}
        page={fetchQuery.page}
        onChange={(event, newPage) => setFetchQuery({ ...fetchQuery, page: newPage })}
        color="primary"
        hidePrevButton
        hideNextButton
        sx={{ 
          alignSelf: 'center',
          '& .MuiPaginationItem-root': {
            lineHeight: 1,
          }
        }} />
      }

      {!isLoading &&
        <Stack direction="column" spacing={2}>

          {(!orders || orders.length === 0) && <Alert 
            severity="info">
              {fetchQuery.menuId ? "Список заказов пуст, попробуйте выбрать другое меню" : "Выберите меню, чтобы загрузить список заказов"}
            </Alert>
          }

          {(orders && orders.length !== 0) && orders.map(order => 
            <React.Fragment key={order.id}>
              <Stack direction="row" spacing={1} sx={{ cursor: "pointer" }} onClick={() => openOrder(order)}>

                <Typography variant="caption" sx={{ flexGrow: 1 }}>
                  <b>{`Заказ №${order.id} отправлен ${formatTime(order.sendTime)}, столик ${order.tableNum}:`}</b><br/>
                  {order.products.filter((_, i) => i < MAX_PRODUCTS_ITEMS_IN_ORDER_CARD).map(product => 
                    <React.Fragment key={product.productId}>&#10004; {product.productName} ({product.amount} {product.amount % 10 >= 2 && product.amount % 10 <= 4 ? "раза" : "раз"})<br/></React.Fragment>
                  )}
                  {order.products.length > MAX_PRODUCTS_ITEMS_IN_ORDER_CARD 
                    ? `и еще ${order.products.length - MAX_PRODUCTS_ITEMS_IN_ORDER_CARD}...` 
                    : undefined
                  }
                </Typography>

                <Stack direction="column" alignItems="end" justifyContent="space-between">
                  <Chip
                    label={STATUS_TRANSLATION[order.status]}
                    color={({ new: "success", executing: "warning" })[order.status] ?? "primary.light"}
                    size="small"
                  />
                  <IconButton onClick={() => onCheckOrderClick(order.id)} sx={{ p: 0, mt: 1.25 }}>
                    {checkedOrders.includes(order.id) ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
                  </IconButton>
                  <Typography variant="button" color="secondary" sx={{ mt: 1 }}>
                    {order.finalAmount}₽
                  </Typography>
                </Stack>
                
              </Stack>
              <Divider />
            </React.Fragment>
          )}
        </Stack>
      }

      {dialogOrder && 
        <Dialog open={isOrderDialogOpen} onClose={() => setIsOrderDialogOpen(false)} maxWidth="xs" fullWidth>

          <DialogContent sx={{ p: 0 }}>
            <Stack direction="column" spacing={1} sx={{ p: 2, pb: 0 }}>

              <Typography variant="h6">
                {`Заказ №${dialogOrder.id}`}
                <Chip
                  label={STATUS_TRANSLATION[dialogOrder.status]}
                  size="small"
                  color={({ new: "success", executing: "warning" })[dialogOrder.status] ?? "primary.light"}
                  sx={{ ml: 1 }}
                />
              </Typography>

              <Typography variant="caption">
                {`${formatTime(dialogOrder.sendTime)}, к столику ${dialogOrder.tableNum}`}
              </Typography>

              <Typography variant="body2">
                <b>Список продуктов:</b><br/>
                {dialogOrder.products.map(product => 
                  <React.Fragment key={product.productId}>&#10004; {product.productName} ({product.amount} {product.amount % 10 >= 2 && product.amount % 10 <= 4 ? "раза" : "раз"})<br/></React.Fragment>
                )}
              </Typography>

              <Stack direction="column" spacing={2}>

                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography variant="button">Итого:</Typography>
                  <Typography variant="button">
                    {dialogOrder.finalAmount}₽
                  </Typography>
                </Stack>

                <FormControl fullWidth>
                  <InputLabel size="small">Новый статус</InputLabel>
                  <Select
                    label="Новый статус"
                    size="small"
                    value={updateStatusQuery.newStatus ?? ''}
                    onChange={(e) => setUpdateStatusQuery({ ...updateStatusQuery, newStatus: e.target.value })}
                  >
                    {Object.keys(STATUS_TRANSLATION).map(key => <MenuItem key={key} value={key}>{STATUS_TRANSLATION[key]}</MenuItem>)}
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel size="small">Для заказов</InputLabel>
                  <Select
                    label="Для заказов"
                    size="small"
                    value={updateStatusQuery.ordersSelector ?? ''}
                    onChange={(e) => setUpdateStatusQuery({ ...updateStatusQuery, ordersSelector: e.target.value })}
                  >
                    {Object.keys(ORDER_SELECTOR_TRANSLATION).map(key => <MenuItem key={key} value={key}>{ORDER_SELECTOR_TRANSLATION[key]}</MenuItem>)}
                  </Select>
                </FormControl>

                <Button variant="contained" color="error" onClick={onUpdateStatusClick}>
                  Обновить статус
                </Button>

              </Stack>

            </Stack>
          </DialogContent>

          <DialogActions>
            <Button variant="text" onClick={() => setIsOrderDialogOpen(false)}>Закрыть</Button>
          </DialogActions>

        </Dialog>
      }
    </>
  )
}

export default withStackContainerShell(OrderList)