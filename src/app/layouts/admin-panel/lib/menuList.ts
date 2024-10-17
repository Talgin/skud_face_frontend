import { Settings, LayoutGrid, Building, LucideIcon, UserCog, Users } from 'lucide-react';

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
					label: 'Организация',
					icon: Building,
					submenus: [
						{
							href: '/organizations',
							label: 'Все организаций',
						},
						{
							href: '/organizations/create',
							label: 'Добавить',
						},
					],
				},
				{
					href: '',
					label: 'Админ',
					icon: UserCog,
					submenus: [
						{
							href: '/admins',
							label: 'Все админы',
						},
						{
							href: '/admins/create',
							label: 'Добавить',
						},
					],
				},
				{
					href: '/',
					label: 'Пользователей',
					icon: Users,
					submenus: [
						{
							href: '/users/create',
							label: 'Добавить новых пользователей',
						},
						{
							href: '/users/create-single-user',
							label: 'Добавить пользователя',
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
