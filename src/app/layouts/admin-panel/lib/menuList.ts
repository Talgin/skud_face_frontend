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
							href: '/organization',
							label: 'Все организаций',
						},
						{
							href: '/organization/create',
							label: 'Создать',
						},
					],
				},
				{
					href: '',
					label: 'Админ',
					icon: UserCog,
					submenus: [
						{
							href: '/admin',
							label: 'Все админы',
						},
						{
							href: '/admin/create',
							label: 'Создать',
						},
					],
				},
				{
					href: '/',
					label: 'Пользователей',
					icon: Users,
					submenus: [
						{
							href: '/users',
							label: 'Все пользователи',
						},
						{
							href: '/user/create',
							label: 'Создать пользователя',
						},
					],
				},
			],
		},
		{
			groupLabel: 'Settings',
			menus: [
				{
					href: '/account',
					label: 'Account',
					icon: Settings,
				},
			],
		},
	];
}
