import Router from 'express'
import { useAuth } from '../middlewares/useAuth.js';
import { useModel } from '../middlewares/useModel.js';
import { badRequest, forbidden, locked, notFound, ok, toManyRequests } from '../utils/responses.js';
import { nextCodeGlobal, Order, OrderEditClient, OrderReturn, OrderStatus } from '../models/orderModels.js';
import { Menu } from '../models/menuModels.js';
import { useUuidParam } from '../middlewares/useParam.js';


const r = new Router();

// create or update order (client)

r.post("/", useModel(OrderEditClient), async (req, res) => {

	const MAX_ORDER_UPDATE_CHAIN_LENGTH = 5;

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

  if (!createModel.prevAccessKey) {
		createModel.code = await nextCodeGlobal();
    const newOrder = await Order.create(createModel);
    const result = OrderReturn.build(newOrder).model;
    return ok(res, result);
  }

	const prevOrder = await Order.findOne({ accessKey: createModel.prevAccessKey })

	if (!prevOrder) {
		return notFound(res, "Заказ, который вы пытаетесь обновить, не найден");
	}

	if (prevOrder.status == OrderStatus.CANCELED) {
		return badRequest(res, "Заказ, который вы хотите обновить, был отменен");
	}

	if (prevOrder.status == OrderStatus.BANNED) {
		return forbidden(res, "Заказ, который вы хотите обновить, был заблокирован");
	}

	if (![OrderStatus.NEW, OrderStatus.EXECUTED].includes(prevOrder.status)) {
		return locked(res, "Ваш заказ уже в работе, обратитесь к сотруднику заведения, чтобы изменить его");
	}

	if ((prevOrder.prevCount ?? 0) >= (MAX_ORDER_UPDATE_CHAIN_LENGTH - 1)) {
		return toManyRequests(res, "Превышен лимит обновлений заказа, отмените заказ и создайте новый или обратитесь к сотруднику заведения");
	}

	prevOrder.status = OrderStatus.CANCELED;
	await prevOrder.save();

	createModel.code = await nextCodeGlobal();
	createModel.prevId = prevOrder.code;
	createModel.prevCount = (prevOrder.prevCount ?? 0) + 1;
  const newOrder = await Order.create(createModel);
	const result = OrderReturn.build(newOrder).model;
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

	if (![OrderStatus.NEW, OrderStatus.EXECUTED].includes(foundOrder.status)) {
		return locked(res, "Ваш заказ уже в работе, сообщите сотруднику заведения, что хотите отменить его");
	}

	// delete all chain

	let currentOrder = foundOrder;
	while (true) {
		const prevId = currentOrder.prevId;
		await Order.findOneAndDelete({ code: currentOrder.code });
		if (!prevId) break;
		currentOrder = await Order.findOne({ code: prevId });
	}

	foundOrder.status = OrderStatus.CANCELED;
	const result = OrderReturn.build(foundOrder).model;
	return ok(res, result);
})

export const orderRouter = r;