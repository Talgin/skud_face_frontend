import { Settings, LayoutGrid, Building, LucideIcon, UserCog, Users, MapPin, Monitor, Camera } from 'lucide-react';

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
							href: '/organization',
							label: 'Все организаций',
						},
						{
							href: '/organization/add',
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
					href: '/point',
					label: 'Точки',
					icon: MapPin,
					submenus: [
						{
							href: '/point',
							label: 'Все точки',
						},
						{
							href: '/point/add',
							label: 'Добавить точку',
						},
					],
				},
				{
					href: '/camera',
					label: 'Камеры',
					icon: Camera,
					submenus: [
						{
							href: '/camera',
							label: 'Все камеры',
						},
						{
							href: '/camera/add',
							label: 'Добавить камеру',
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
