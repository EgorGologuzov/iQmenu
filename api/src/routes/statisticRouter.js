import Router from 'express'
import { useModel } from '../middlewares/useModel.js';
import { Event, EventCreate, EventListReturn, EventReturn, EventType } from '../models/statisticModels.js';
import { Menu } from '../models/menuModels.js';
import { badRequest, forbidden, notFound, ok } from '../utils/responses.js';
import { useIntegerQueryParam } from '../middlewares/useQueryParam.js';
import { useAuth } from '../middlewares/useAuth.js';


const r = new Router();

r.post("/", useModel(EventCreate), async (req, res) => {

  const createModel = req.model;

	if (createModel.event === EventType.VIEW_MENU) {
		delete createModel.productName;
	} else {
		if (!createModel.productName) return badRequest(res, "productName обязательно для этого типа события");
	}

	const isMenuExists = await Menu.exists({ code: createModel.menuId, isActive: true });
	if (!isMenuExists) {
		return notFound(res, "Меню с таким идентификатором не существует или оно снято с публикации");
	}

	createModel.userAgent = req.get('user-agent');

	await Event.create(createModel);

	return ok(res);
});

r.get("/",
	useAuth(),
	useIntegerQueryParam({ name: "menuId", required: true, min: 0 }),
	useIntegerQueryParam({ name: "lastDays", required: true, min: 1 }),
	async (req, res) => {

	const { userId } = req.user;
	const { menuId, lastDays } = req;

	const foundMenu = await Menu.findOne({ code: menuId }).exec();

	if (!foundMenu) {
		return notFound(res, "Меню с таким идентифактором не найдено");
	}

	if (foundMenu.ownerId !== userId) {
		return forbidden(res, "Это меню принадлежит другому пользователю");
	}

	const border = new Date();
	border.setDate(border.getDate() - lastDays);

	const query = { menuId: menuId, sendTime: { $gte: border } };
	const events = await Event.find(query).sort({ sendTime: -1 });
	const result = EventListReturn.build({ events: events }).model;

	return ok(res, result);
})

export const statisticRouter = r;