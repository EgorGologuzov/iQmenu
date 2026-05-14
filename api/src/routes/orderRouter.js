import Router from 'express'
import { useAuth } from '../middlewares/useAuth.js';
import { useModel } from '../middlewares/useModel.js';
import { badRequest, forbidden, locked, notFound, ok, toManyRequests } from '../utils/responses.js';
import { nextCodeGlobal, Order, OrderEditClient, OrderListReturn, OrderReturn, OrderStatus, UpdateOrdersStatusById, UpdateOrdersStatusByFilters } from '../models/orderModels.js';
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

	let newProductsWithNames = [];
	let newFinalAmount = 0;
	let isAllProductsActual = true;

	createModel.products.forEach(productInCart => {
		const product = foundMenu.products.find(product => product.code == productInCart.productId);
		if (product?.isActive) {
			newProductsWithNames.push({ ...productInCart, productName: product.name });
			newFinalAmount += product.price * productInCart.amount;
		} else {
			isAllProductsActual = false;
		}
	})

	if (!isAllProductsActual) {
		return badRequest(res, "В заказе есть продукты, которых временно нет в наличии");
	}

	const createNewOrder = async () => {
		createModel.code = await nextCodeGlobal();
		createModel.ownerId = foundMenu.ownerId;
		createModel.products = newProductsWithNames;
		createModel.finalAmount = newFinalAmount;
    const newOrder = await Order.create(createModel);
    return OrderReturn.build(newOrder).model;
	}

	const updateOrder = async () => {
		foundOrder.tableNum = createModel.tableNum;
		foundOrder.products = newProductsWithNames;
		foundOrder.finalAmount = newFinalAmount;
		await foundOrder.save();
		return OrderReturn.build(foundOrder).model;
	}

  if (!createModel.prevAccessKey) {
		const result = await createNewOrder();
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
		result = await updateOrder();
	} else {
		result = await createNewModel();
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
    finalAmountMax,
  } = req;

	const foundMenu = await Menu.findOne({ code: menuId }).exec();
	const { userId } = req.user;

	if (!foundMenu) {
		return notFound(res, "Меню с таким идентификатором не найдено");
	}

	if (foundMenu.ownerId !== userId) {
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

// update orders statuses by filters

r.patch("/update/status/by/filters", useAuth(), useModel(UpdateOrdersStatusByFilters), async (req, res) => {

  const { 
    menuId, 
    tableNum, 
    sendTimeStart, 
    sendTimeEnd, 
    status, 
    finalAmountMin, 
    finalAmountMax 
  } = req.model;

	const newStatus = req.model.newStatus;

	const foundMenu = await Menu.findOne({ code: menuId }).exec();
	const { userId } = req.user;

	if (!foundMenu) {
		return notFound(res, "Меню с таким идентификатором не найдено");
	}

	if (foundMenu.ownerId !== userId) {
		return forbidden(res, "Отказано в доступе. Это меню принадлежит другому пользователю.");
	}

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

	const result = await Order.updateMany(query, { $set: { status: newStatus } });

	return ok(res, { matchedCount: result.matchedCount, modifiedCount: result.modifiedCount });
})

// update orders statuses by ids

r.patch("/update/status/by/ids", useAuth(), useModel(UpdateOrdersStatusById), async (req, res) => {

	const { userId } = req.user;
	const ids = req.model.ids;
	const newStatus = req.model.newStatus;

	const query = { ownerId: userId, code: { $in: ids } }
	const result = await Order.updateMany(query, { $set: { status: newStatus } });

	return ok(res, { matchedCount: result.matchedCount, modifiedCount: result.modifiedCount });
})

export const orderRouter = r;