import type { ColumnDef } from "@tanstack/react-table";
import {
  AgeCell,
  formatGender,
  formatReview,
  formatSimilarity,
  type HistoryRecord,
  PersonCell,
} from "@/entities/monitoring";
import { intlLocale, t } from "@/shared/i18n";
import { EvidenceImage } from "@/shared/ui/evidence-image";
export const historyColumns: ColumnDef<HistoryRecord>[] = [
  {
    accessorKey: "crop_image_url",
    header: t("Фото"),
    cell: ({ row }) => {
      return (
        <EvidenceImage
          url={row.getValue<string>("crop_image_url")}
          alt="face"
          className="h-16 w-16 object-cover rounded-md border"
        />
      );
    },
    enableSorting: false,
    enableColumnFilter: false,
  },
  {
    accessorKey: "datetime",
    header: t("Дата/время"),
    cell: ({ getValue }) => {
      const iso = getValue<string>();
      return new Date(iso).toLocaleString(intlLocale());
    },
    sortingFn: "datetime",
  },
  {
    accessorKey: "camera_id",
    header: t("Камера"),
    cell: ({ row }) => {
      return <span>{row.original.camera_id}</span>;
    },
  },
  {
    id: "person",
    header: t("Человек"),
    cell: ({ row }) => <PersonCell event={row.original} />,
  },
  {
    accessorKey: "recognition_confidence",
    header: t("Сходство"),
    cell: ({ row }) => {
      const { text, className } = formatSimilarity(
        row.original.recognition_confidence,
        row.original.is_known,
      );
      return <span className={className}>{text}</span>;
    },
    sortingFn: "basic",
  },
  {
    accessorKey: "gender",
    header: t("Пол"),
    cell: ({ getValue }) => formatGender(getValue<string | null>()),
  },
  {
    accessorKey: "age",
    header: t("Возраст"),
    cell: ({ row }) => <AgeCell event={row.original} />,
  },
  {
    accessorKey: "review_status",
    header: t("Проверка"),
    cell: ({ row }) => {
      const { text, className } = formatReview(row.original);
      return <span className={className}>{text}</span>;
    },
  },
];
