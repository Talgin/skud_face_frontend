import Cookie from 'js-cookie';
import { ACCESS_TOKEN } from '@/entities/session';

export function logout() {
	Cookie.remove(ACCESS_TOKEN);
}
