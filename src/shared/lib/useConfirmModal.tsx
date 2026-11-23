import { create as createModal, useModal } from "@ebay/nice-modal-react";
import { Loader2 } from "lucide-react";
import { t } from "@/shared/i18n";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog";

type Props = {
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
};

const DEFAULT_CONFIRM_TITLE = t("Вы уверены что хотите удалить?");
const DEFAULT_CONFIRM_TEXT = t("Да");
const DEFAULT_CANCEL_TEXT = t("Нет");

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
          <AlertDialogAction onClick={onConfirm} disabled={props.isLoading}>
            {props.isLoading ? <Loader2 /> : <span>{confirmText}</span>}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export const ConfirmModal = createModal(ConfirmModalPresenter);

export function useConfirmModal() {
  return useModal(ConfirmModal);
}
