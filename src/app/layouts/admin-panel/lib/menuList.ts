import { Settings, LayoutGrid, Building, LucideIcon, UserCog, Users, MapPin, Monitor } from 'lucide-react';

type Submenu = {
	href: string;
	label: string;
	active?: boolean;
};

type Menu = {
	href: string;
	label: string;
	active?: boolean;
	icon: LucideIcon;
	submenus?: Submenu[];
};

type Group = {
	groupLabel: string;
	menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
	return [
		{
			groupLabel: '',
			menus: [
				{
					href: '/monitoring',
					label: 'Мониторинг',
					icon: Monitor,
					submenus: [],
				},
				{
					href: '/dashboard',
					label: 'Дашборд',
					icon: LayoutGrid,
					submenus: [],
				},
			],
		},
		{
			groupLabel: 'Формы',
			menus: [
				{
					href: '',
					label: 'Организации',
					icon: Building,
					submenus: [
						{
							href: '/organizations',
							label: 'Все организаций',
						},
						{
							href: '/organizations/add',
							label: 'Добавить',
						},
					],
				},
				{
					href: '',
					label: 'Админы',
					icon: UserCog,
					submenus: [
						{
							href: '/admins',
							label: 'Все админы',
						},
						{
							href: '/admins/add',
							label: 'Добавить',
						},
					],
				},
				{
					href: '/',
					label: 'Пользователи',
					icon: Users,
					submenus: [
						{
							href: '/users',
							label: 'Все пользователи',
						},
						{
							href: '/users/add',
							label: 'Добавить новых пользователей',
						},
						{
							href: '/users/add-single-user',
							label: 'Добавить пользователя',
						},
					],
				},
				{
					href: '/points',
					label: 'Точки',
					icon: MapPin,
					submenus: [
						{
							href: '/points',
							label: 'Все точки',
						},
						{
							href: '/points/add',
							label: 'Добавить точку',
						},
					],
				},
			],
		},
		{
			groupLabel: 'Settings',
			menus: [
				{
					href: '/profile',
					label: 'Личный кабинет',
					icon: Settings,
				},
			],
		},
	];
}
