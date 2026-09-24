import type { ColumnDef } from "@tanstack/react-table";
import { formatSimilarity, type HistoryRecord } from "@/entities/monitoring";

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
    accessorKey: "recognition_confidence",
    header: "Сходство",
    cell: ({ getValue }) => {
      const { text, className } = formatSimilarity(getValue<number | null>());
      return <span className={className}>{text}</span>;
    },
    sortingFn: "basic",
  },
  {
    accessorKey: "gender",
    header: "Пол",
    cell: ({ getValue }) => getValue<string>() ?? "-",
  },
  {
    accessorKey: "age",
    header: "Возраст",
    cell: ({ getValue }) => getValue<number | null>() ?? "-",
  },
  {
    accessorKey: "glasses",
    header: "Очки",
    cell: ({ getValue }) => (getValue<boolean | null>() ? "Да" : "Нет"),
  },
  {
    accessorKey: "mask",
    header: "Маска",
    cell: ({ getValue }) => (getValue<boolean | null>() ? "Да" : "Нет"),
  },
  {
    accessorKey: "emotion",
    header: "Эмоция",
    cell: ({ getValue }) => getValue<string>() ?? "-",
  },
];
