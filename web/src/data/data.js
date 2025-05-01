import { MENU_SERVICE as FAKE_MENU_SERVICE } from "./static/menu"
import { USER_SERVICE as FAKE_USER_SERVICE } from "./static/user"
import { MENU_SERVICE as REAL_MENU_SERVICE } from "./api/menu"
import { USER_SERVICE as REAL_USER_SERVICE } from "./api/user"
import { MEDIA_SERVICE as FAKE_MEDIA_SERVICE } from "./static/media"

export const MENU_SERVICE = FAKE_MENU_SERVICE;
export const USER_SERVICE = FAKE_USER_SERVICE;
export const MEDIA_SERVICE = FAKE_MEDIA_SERVICE;
