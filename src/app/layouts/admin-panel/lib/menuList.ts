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
							href: '/organizations/register',
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
							href: '/admins/register',
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
							href: '/users/register',
							label: 'Добавить новых пользователей',
						},
						{
							href: '/users/register-by-one',
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
