import { handleHttpError } from '../../utils/http';

const LOCAL_STATISTIC_LIFETIME_MILLIS = 3 * 3600 * 1000;
const LOCAL_STATISTIC_KEY = "data/statistic/localStatistic";

const LOCAL_STATISTIC_DEFAULT = {
	saveTime: null,
	sentRequests: [], // strings in format `${event}-${menuId}-${productName}-${etc}`
}

function readLocalStatistic() {
	const str = localStorage.getItem(LOCAL_STATISTIC_KEY);
	const localStat = str ? JSON.parse(str) : null;
	const lastSave = localStat?.saveTime;
	return lastSave && (new Date() - new Date(lastSave)) <= LOCAL_STATISTIC_LIFETIME_MILLIS ? localStat : LOCAL_STATISTIC_DEFAULT;
}

const localStatistic = readLocalStatistic();

function saveLocalStatistic() {
	localStatistic.saveTime = new Date();
	localStorage.setItem(LOCAL_STATISTIC_KEY, JSON.stringify(localStatistic));
}

export const STATISTIC_SERVICE = {

	async sendStatistic(info) {
		const requestStr = Object.keys(info).map(key => info[key]).join("-");
		if (!localStatistic.sentRequests.includes(requestStr)) {
			await STATISTIC_SERVICE.http.post('/statistic', info);
			localStatistic.sentRequests.push(requestStr);
			saveLocalStatistic();
		}
	},

	async sendMenuView(menuId) {
		try {
			await this.sendStatistic({ event: "view-menu", menuId });
		} catch (error) {
			handleHttpError(error);
		}
	},

	async sendProductView(menuId, productName) {
		try {
			await this.sendStatistic({ event: "view-product", menuId, productName });
		} catch (error) {
			handleHttpError(error);
		}
	},

	async sendProductLike(menuId, productName) {
		try {
			await this.sendStatistic({ event: "like-product", menuId, productName });
		} catch (error) {
			handleHttpError(error);
		}
	},

	async getViewsStatistic(params) {
		try {
			const response = await STATISTIC_SERVICE.http.get('/statistic', { params });
			return response.data;
		} catch (error) {
			handleHttpError(error);
		}
	},

	async getOrdersDownload(params) {
		try {
			const response = await STATISTIC_SERVICE.http.get('/statistic/order', { params });
			return response.data;
		} catch (error) {
			handleHttpError(error);
		}
	},

}