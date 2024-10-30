import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/shared/ui/alert-dialog';
import { create as createModal, useModal } from '@ebay/nice-modal-react';

type Props = {
	onConfirm: () => void;
	onCancel: () => void;
	title?: string;
	confirmText?: string;
	cancelText?: string;
};

const DEFAULT_CONFIRM_TITLE = 'Вы уверены что хотите удалить?';
const DEFAULT_CONFIRM_TEXT = 'Да';
const DEFAULT_CANCEL_TEXT = 'Нет';

export function ConfirmModalPresenter(props: Props) {
	const {
		onConfirm,
		onCancel,
		title = DEFAULT_CONFIRM_TITLE,
		confirmText = DEFAULT_CONFIRM_TEXT,
		cancelText = DEFAULT_CANCEL_TEXT,
	} = props;

	return (
		<AlertDialog open={true}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={onCancel}>{cancelText}</AlertDialogCancel>
					<AlertDialogAction onClick={onConfirm}>{confirmText}</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export const ConfirmModal = createModal(ConfirmModalPresenter);

export function useConfirmModal() {
	return useModal(ConfirmModal);
}
