import type { ColumnDef } from "@tanstack/react-table";
import {
  AgeCell,
  formatGender,
  formatReview,
  formatSimilarity,
  type HistoryRecord,
  PersonCell,
} from "@/entities/monitoring";

export const historyColumns: ColumnDef<HistoryRecord>[] = [
  {
    accessorKey: "crop_image_url",
    header: "Фото",
    cell: ({ row }) => {
      const url = row.getValue<string>("crop_image_url");
      return (
        <img
          src={url}
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
    header: "Дата/время",
    cell: ({ getValue }) => {
      const iso = getValue<string>();
      return new Date(iso).toLocaleString();
    },
    sortingFn: "datetime",
  },
  {
    accessorKey: "camera_id",
    header: "Камера",
    cell: ({ row }) => {
      return <span>{row.original.camera_id}</span>;
    },
  },
  {
    id: "person",
    header: "Человек",
    cell: ({ row }) => <PersonCell event={row.original} />,
  },
  {
    accessorKey: "recognition_confidence",
    header: "Сходство",
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
    header: "Пол",
    cell: ({ getValue }) => formatGender(getValue<string | null>()),
  },
  {
    accessorKey: "age",
    header: "Возраст",
    cell: ({ row }) => <AgeCell event={row.original} />,
  },
  {
    accessorKey: "review_status",
    header: "Проверка",
    cell: ({ row }) => {
      const { text, className } = formatReview(row.original);
      return <span className={className}>{text}</span>;
    },
  },
];
