import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useNavigate } from "@tanstack/react-router";

import { Pencil } from "lucide-react";
import { useEffect } from "react";
import { type AccessReq, useCan } from "@/entities/role";
import { useConfirmModal } from "@/shared/lib/useConfirmModal";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

export type TableRowActionsProps = {
  editRouteTo: string;
  onConfirm: () => void;
  isDeletedSuccessfully: boolean;
  isLoading: boolean;
  permissions?: {
    edit?: AccessReq;
    delete?: AccessReq;
  };
  onDeny?: "hide" | "disable";
};

export function TableRowActions(props: TableRowActionsProps) {
  const confirmRemoveModal = useConfirmModal();
  const navigate = useNavigate();
  const { can } = useCan();

  const canEdit = props.permissions?.edit ? can(props.permissions.edit) : true;
  const canDelete = props.permissions?.delete
    ? can(props.permissions.delete)
    : true;

  const showEdit = props.onDeny === "hide" ? canEdit : true;
  const showDelete = props.onDeny === "hide" ? canDelete : true;

  const handleEditButtonClick = () => {
    if (!canEdit) return;
    navigate({ to: props.editRouteTo });
  };

  const handleRemoveButtonClick = () => {
    if (!canDelete) return;
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
  }, [props.isDeletedSuccessfully, confirmRemoveModal.remove]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Открой меню</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        {showEdit && (
          <DropdownMenuItem onClick={handleEditButtonClick} disabled={!canEdit}>
            Редактировать
            <DropdownMenuShortcut>
              <Pencil size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        )}
        {showEdit && showDelete && <DropdownMenuSeparator />}
        {showDelete && (
          <DropdownMenuItem
            onClick={handleRemoveButtonClick}
            disabled={!canDelete}
          >
            Удалить
            <DropdownMenuShortcut>
              <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
