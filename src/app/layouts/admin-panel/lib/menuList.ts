import { Tag, Users, Settings, Bookmark, LayoutGrid, Building, LucideIcon } from 'lucide-react';

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
							href: '/posts',
							label: 'All Posts',
						},
						{
							href: '/posts/new',
							label: 'New Post',
						},
					],
				},
				{
					href: '/categories',
					label: 'Categories',
					icon: Bookmark,
				},
				{
					href: '/tags',
					label: 'Tags',
					icon: Tag,
				},
			],
		},
		{
			groupLabel: 'Settings',
			menus: [
				{
					href: '/users',
					label: 'Users',
					icon: Users,
				},
				{
					href: '/account',
					label: 'Account',
					icon: Settings,
				},
			],
		},
	];
}
