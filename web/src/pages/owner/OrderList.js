import React, { useEffect, useState } from 'react'
import OwnerNavBar from '../../components/navs/OwnerNavBar';
import withStackContainerShell from '../../hoc/withStackContainerShell';
import useTitle from '../../hooks/useTitle';
import useIQmenuApi from '../../hooks/useIQmenuApi';
import { useSelector } from 'react-redux';
import { Alert, Button, Chip, CircularProgress, Divider, FormControl, IconButton, InputLabel, MenuItem, Pagination, Select, Stack, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { STATUS_TRANSLATION } from '../../values/strings';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import OrderEditStatusDialog from '../../components/dialogs/OrderEditStatusDialog';
import { formatRelativeTime, formatTime } from '../../utils/utils';
import OrderFiltersDialog from '../../components/dialogs/OrderFiltersDialog';

const MAX_PRODUCTS_ITEMS_IN_ORDER_CARD = 5;

function OrderList() {

  const [query, setQuery] = useState({ page: 1 });
  const [checkedOrders, setCheckedOrders] = useState([]);

  const [isFiltersDialogOpened, setIsFiltersDialogOpened] = useState(false);
  const [isOrderDialogOpened, setIsOrderDialogOpened] = useState(false);
  const [currentOrder, setCurrentOrder] = useState();

  const api = useIQmenuApi();
  const userId = useSelector(state => state.user.id);

  const { data: allMenus, isLoading: isMenusLoading, error: menusError } = useQuery({
    queryKey: [`api.menu.getUsersMenus`, userId],
    queryFn: () => api.menu.getUsersMenus(userId),
    refetchOnWindowFocus: false,
  })

  const { data: ordersData, isLoading: isOrdersLoading, error: ordersError, refetch: refetchOrders } = useQuery({
    queryKey: [`api.order.getOrders`, query],
    queryFn: () => api.order.getOrders(query),
    refetchOnWindowFocus: false,
    enabled: !!query.page && !!query.menuId,
  })

  const isLoading = isMenusLoading || isOrdersLoading;
  const lastError = ordersError || menusError;
  const orders = ordersData?.orders;
  const pagesCount = ordersData?.pagesCount;

  const onCheckOrderClick = (event, orderId) => {
    event.stopPropagation();
    if (checkedOrders.includes(orderId)) {
      setCheckedOrders(checkedOrders.filter(id => id !== orderId));
    } else {
      setCheckedOrders([...checkedOrders, orderId]);
    }
  };

  const openOrder = (order) => {
    setCurrentOrder(order);
    setIsOrderDialogOpened(true);
  }

	useTitle({ general: "Заказы по вашим меню" }, []);

  useEffect(() => setCheckedOrders([]), [ordersData])

  return (
    <>
			<OwnerNavBar />

      {lastError && <Alert severity="error">{lastError.message}</Alert>}

      <Stack direction="row" spacing={1}>

        <FormControl fullWidth>
          <InputLabel size="small">Меню</InputLabel>
          <Select
            label="Меню"
            size="small"
            value={query.menuId ?? ''}
            onChange={(e) => setQuery({ ...query, menuId: e.target.value })}
          >
            {allMenus && allMenus.map(menu => <MenuItem key={menu.id} value={menu.id}>{`${menu.menuName} / ${menu.companyName}`}</MenuItem>)}
          </Select>
        </FormControl>

        <Button variant="contained" onClick={() => setIsFiltersDialogOpened(true)}>
          <FilterAltIcon />
        </Button>

      </Stack>

      {isLoading && <CircularProgress disableShrink sx={{ alignSelf: 'center' }} />}

      {!isLoading && typeof pagesCount === "number" && pagesCount > 1 && <Pagination 
        count={pagesCount}
        page={query.page}
        onChange={(event, newPage) => setQuery({ ...query, page: newPage })}
        color="primary"
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
              {query.menuId ? "Список заказов пуст, попробуйте выбрать другое меню" : "Выберите меню, чтобы загрузить список заказов"}
            </Alert>
          }

          {(orders && orders.length !== 0) && orders.map(order => 
            <React.Fragment key={order.id}>
              <Stack direction="row" spacing={1} sx={{ cursor: "pointer" }} onClick={() => openOrder(order)}>

                <Typography variant="body2" sx={{ flexGrow: 1 }}>

                  <Typography variant="caption">
                    {`${formatRelativeTime(order.sendTime)} (${formatTime(order.sendTime)})`}<br/>
                  </Typography>
                  
                  <b>{`Заказ  №${order.id}, столик ${order.tableNum}:`}</b><br/>

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
                    sx={{ fontWeight: 500 }}
                  />
                  <IconButton onClick={(event) => onCheckOrderClick(event, order.id)} sx={{ p: 1, mt: 0.5 }}>
                    {checkedOrders.includes(order.id) ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
                  </IconButton>
                  <Typography variant="button" color="secondary">
                    {order.finalAmount}₽
                  </Typography>
                </Stack>
                
              </Stack>
              <Divider />
            </React.Fragment>
          )}
        </Stack>
      }

      {currentOrder && isOrderDialogOpened && <OrderEditStatusDialog 
        open={isOrderDialogOpened}
        order={currentOrder}
        checkedOrdersIds={checkedOrders}
        filters={query}
        onClose={() => setIsOrderDialogOpened(false)}
        onOrdersUpdated={refetchOrders} />
      }

      {isFiltersDialogOpened && <OrderFiltersDialog 
        open={isFiltersDialogOpened}
        defaultFilters={query}
        onClose={() => setIsFiltersDialogOpened(false)}
        onFiltersUpdated={(filters) => setQuery({ ...query, ...filters })} />
      }
    </>
  )
}

export default withStackContainerShell(OrderList)