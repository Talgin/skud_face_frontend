import Cookie from 'js-cookie';
import { ACCESS_TOKEN } from './const';

export function isAuthenticated() {
	return Boolean(Cookie.get(ACCESS_TOKEN));
}
