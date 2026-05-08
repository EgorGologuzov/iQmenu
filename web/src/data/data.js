import { MENU_SERVICE as FAKE_MENU_SERVICE } from "../data/static/menu"
import { USER_SERVICE as FAKE_USER_SERVICE } from "../data/static/user"
import { MEDIA_SERVICE as FAKE_MEDIA_SERVICE } from "../data/static/media"

import { MENU_SERVICE as REAL_MENU_SERVICE } from "../data/api/menu"
import { USER_SERVICE as REAL_USER_SERVICE } from "../data/api/user"
import { MEDIA_SERVICE as REAL_MEDIA_SERVICE } from "../data/api/media"
import { ORDER_SERVICE as REAL_ORDER_SERVICE } from "../data/api/order"

export function getServices(http) {
	const services = {}

	if (process.env.REACT_APP_USE_LOCAL_DATA_SOURCE === "true") {
		services.menu = FAKE_MENU_SERVICE;
		services.user = FAKE_USER_SERVICE;
		services.media = FAKE_MEDIA_SERVICE;
	} else {
		services.menu = REAL_MENU_SERVICE;
		services.user = REAL_USER_SERVICE;
		services.media = REAL_MEDIA_SERVICE;
		services.order = REAL_ORDER_SERVICE;
	}

	Object.keys(services).forEach(service => {
		services[service].services = services;
		services[service].http = http;
	});

	return services;
}
