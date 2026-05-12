import Router from 'express'
import { useAuth } from '../middlewares/useAuth.js';
import { useModel } from '../middlewares/useModel.js';
import { badRequest, forbidden, locked, notFound, ok, toManyRequests } from '../utils/responses.js';
import { nextCodeGlobal, Order, OrderEditClient, OrderListReturn, OrderReturn, OrderStatus } from '../models/orderModels.js';
import { Menu } from '../models/menuModels.js';
import { useIntegerParam, useUuidParam } from '../middlewares/useParam.js';
import { useDatetimeQueryParam, useIntegerQueryParam, useStringQueryParam } from '../middlewares/useQueryParam.js';


const r = new Router();

// create or update order (client)

r.post("/", useModel(OrderEditClient), async (req, res) => {

  const createModel = req.model;

	const foundMenu = await Menu.findOne({ code: createModel.menuId }).exec();
	if (!foundMenu?.isActive) {
		return notFound(res, "Меню, по которому вы хотите оформить заказ, не существует или снято с публикации");
	}

	const isAllProductsActual = createModel.products
		.filter(productInCart => foundMenu.products.find(product => product.code == productInCart.productId)?.isActive).length == createModel.products.length;

	if (!isAllProductsActual) {
		return badRequest(res, "В заказе есть продукты, которых временно нет в наличии");
	}

	const calcOrderAmount = () => {
		return createModel.products.reduce((sum, productInCart) => 
			sum + foundMenu.products.find(product => product.code == productInCart.productId).price * productInCart.amount,
			0
		)
	}

  if (!createModel.prevAccessKey) {
		createModel.code = await nextCodeGlobal();
		createModel.finalAmount = calcOrderAmount();
    const newOrder = await Order.create(createModel);
    const result = OrderReturn.build(newOrder).model;
    return ok(res, result);
  }

	const foundOrder = await Order.findOne({ accessKey: createModel.prevAccessKey })

	if (!foundOrder) {
		return notFound(res, "Заказ, который вы пытаетесь обновить, не найден");
	}

	if (foundOrder.status == OrderStatus.BANNED) {
		return forbidden(res, "Заказ, который вы хотите обновить, был заблокирован");
	}

	if (foundOrder.status == OrderStatus.EXECUTING) {
		return locked(res, "Ваш заказ уже в работе, обратитесь к сотруднику заведения, чтобы изменить его");
	}

	let result = null;

	if (foundOrder.status == OrderStatus.NEW) {
		foundOrder.tableNum = createModel.tableNum;
		foundOrder.products = createModel.products;
		foundOrder.finalAmount = calcOrderAmount();
		await foundOrder.save();
		result = OrderReturn.build(foundOrder).model;
	}
	else if (foundOrder.status == OrderStatus.EXECUTED || foundOrder.status == OrderStatus.CANCELED){
		createModel.code = await nextCodeGlobal();
		createModel.finalAmount = calcOrderAmount();
    const newOrder = await Order.create(createModel);
    result = OrderReturn.build(newOrder).model;
	}

	return ok(res, result);
})

// cancel order (client)

r.patch("/:orderAccessKey/cancel", useUuidParam("orderAccessKey"), async (req, res) => {

	const accessKey = req.orderAccessKey;
	const foundOrder = await Order.findOne({ accessKey: accessKey })

	if (!foundOrder) {
		return notFound(res, "Заказ, который вы пытаетесь отменить, не найден");
	}

	if (foundOrder.status == OrderStatus.CANCELED) {
		return badRequest(res, "Заказ, который вы хотите отменить, уже отменен");
	}

	if (foundOrder.status == OrderStatus.BANNED) {
		return forbidden(res, "Заказ, который вы хотите отменить, был заблокирован");
	}

	if (foundOrder.status == OrderStatus.EXECUTING || foundOrder.status == OrderStatus.EXECUTED) {
		return locked(res, "Ваш заказ уже в работе, сообщите сотруднику заведения, что хотите отменить его");
	}

	foundOrder.status = OrderStatus.CANCELED;
	await foundOrder.save();
	const result = OrderReturn.build(foundOrder).model;

	return ok(res, result);
})

// get orders list

r.get("/",
	useAuth(),
	useIntegerQueryParam({ name: "page", required: true, min: 1 }),
	useIntegerQueryParam({ name: "menuId", required:  true }),
	useStringQueryParam({ name: "tableNum" }),
	useDatetimeQueryParam({ name: "sendTimeStart" }),
	useDatetimeQueryParam({ name: "sendTimeEnd" }),
	useStringQueryParam({ name: "status" }),
	useIntegerQueryParam({ name: "finalAmountMin" }),
	useIntegerQueryParam({ name: "finalAmountMax" }),

	async (req, res) => {

  const { 
		page,
    menuId, 
    tableNum, 
    sendTimeStart, 
    sendTimeEnd, 
    status, 
    finalAmountMin, 
    finalAmountMax 
  } = req;

	const foundMenu = await Menu.findOne({ code: menuId }).exec();
	const { userId } = req.user;

	if (foundMenu?.ownerId !== userId) {
		return forbidden(res, "Отказано в доступе. Это меню принадлежит другому пользователю.");
	}

	const LIMIT = 2;
	const skip = (page - 1) * LIMIT;

  const query = { menuId };

  if (tableNum) query.tableNum = tableNum;
  if (status) query.status = status;

  if (sendTimeStart || sendTimeEnd) {
    query.sendTime = {};
    if (sendTimeStart) query.sendTime.$gte = sendTimeStart;
    if (sendTimeEnd) query.sendTime.$lte = sendTimeEnd;
  }

  if (finalAmountMin !== undefined || finalAmountMax !== undefined) {
    query.finalAmount = {};
    if (finalAmountMin !== undefined) query.finalAmount.$gte = finalAmountMin;
    if (finalAmountMax !== undefined) query.finalAmount.$lte = finalAmountMax;
  }

  const [orders, totalCount] = await Promise.all([
		Order.find(query)
			.sort({ sendTime: -1 })
			.skip(skip)
			.limit(LIMIT),
		Order.countDocuments(query)
	]);

	const result = OrderListReturn.build({ orders, pagesCount: Math.ceil(totalCount / LIMIT) }).model;

  return ok(res, result);
})

export const orderRouter = r;