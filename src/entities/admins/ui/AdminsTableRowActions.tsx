import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';

export function AdminsTableRowActions() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
					<DotsHorizontalIcon className="h-4 w-4" />
					<span className="sr-only">Открой меню</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-[160px]">
				<DropdownMenuItem>
					Редактировать
					<DropdownMenuShortcut>
						<Pencil size={16} />
					</DropdownMenuShortcut>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuSeparator />
				<DropdownMenuItem>
					Удалить
					<DropdownMenuShortcut>
						<Trash2 size={18} />
					</DropdownMenuShortcut>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
