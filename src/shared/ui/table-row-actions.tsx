import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { useNavigate } from '@tanstack/react-router';

import { Pencil } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { useConfirmModal } from '@/shared/lib/useConfirmModal';
import { useEffect } from 'react';

export type TableRowActionsProps = {
	editRouteTo: string;
	onConfirm: () => void;
	isDeletedSuccessfully: boolean;
	isLoading: boolean;
};

export function TableRowActions(props: TableRowActionsProps) {
	const confirmRemoveModal = useConfirmModal();
	const navigate = useNavigate();

	const handleEditButtonClick = () => {
		navigate({ to: props.editRouteTo });
	};

	const handleRemoveButtonClick = () => {
		confirmRemoveModal.show({
			onCancel: () => confirmRemoveModal.remove(),
			onConfirm: () => {
				props.onConfirm();
			},
			isLoading: props.isLoading,
		});
	};

	useEffect(() => {
		if (props.isDeletedSuccessfully) {
			confirmRemoveModal.remove();
		}
	}, [props.isDeletedSuccessfully]);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
					<DotsHorizontalIcon className="h-4 w-4" />
					<span className="sr-only">Открой меню</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-[160px]">
				<DropdownMenuItem onClick={handleEditButtonClick}>
					Редактировать
					<DropdownMenuShortcut>
						<Pencil size={16} />
					</DropdownMenuShortcut>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={handleRemoveButtonClick}>
					Удалить
					<DropdownMenuShortcut>
						<DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
					</DropdownMenuShortcut>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
