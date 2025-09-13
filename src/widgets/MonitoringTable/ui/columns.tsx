// widgets/monitoringTable/columns.tsx
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import type { MonitoringEvent } from "@/entities/monitoring";
import { ConfirmButton } from "@/features/monitoring/confirmEvent";
import { RejectButton } from "@/features/monitoring/rejectEvent";

/*
{
'id': '76a8bc7c-bfdd-43a1-ac6d-c9748ebea969',
'event_id': '1756640516960-0',
'camera_host': '10.1.22.5',
'camera_id': 421,
'crop_image_url': 'http://10.1.22.5:50005/face-crops-bucket/74db453f-6b96-4ff9-8f5d-833306fbd8bd.jpg',
'datetime': '2025-08-31T11:41:56Z',
'face_id': 'a7e3b389-f702-472f-ab72-f9a76137062f',
'distance': 1.0,
'face_image_url': None,
'frame_image_url': 'http://10.1.22.5:50005/face-full-frames-bucket/cd6dbb80-047f-4753-b34f-0a83a07ae1c0.jpg',
'recognition_confidence': 1.0,
'h': 104,
'w': 85,
'x': 1402,
'y': 261,
'delivered': True,
'age': 35,
'gender': 'male',
'beard': False,
'glasses': False,
'mask': False,
'color_hat': 'none',
'color_shirt': 'none',
'color_pants': 'none',
'color_shoes': 'none',
'_id': ObjectId('68b43504a1fd37097674a12a')}
 */

export const getMonitoringColumns: (
  canActions: boolean,
) => ColumnDef<MonitoringEvent>[] = (canActions) => {
  const columns: ColumnDef<MonitoringEvent>[] = [
    {
      accessorKey: "crop_image_url",
      header: "Image",
      cell: ({ row }) => {
        const url = row.getValue<string>("crop_image_url");
        return (
          <img
            src={url}
            alt="face"
            className="h-24 w-24 object-cover rounded-md"
          />
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: "frame_image_url",
      header: "Frame Image",
      cell: ({ row }) => {
        const url = row.getValue<string>("frame_image_url");
        return (
          <img
            src={url}
            alt="face"
            className="h-24 w-24 object-cover rounded-md"
          />
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: "camera",
      header: "Камера",
      cell: ({ row }) => {
        const room = `Камера ${row.original.camera_host}:${row.original.camera_id}`;
        return <>{room}</>;
      },
    },
    {
      accessorKey: "recognition_confidence",
      header: "Точность",
      cell: ({ getValue }) => {
        const conf: number = getValue<number>() * 100;
        const display = conf.toFixed(1) + "%";
        return conf >= 80 ? (
          <span className="text-green-600">{display}</span>
        ) : conf >= 50 ? (
          <span className="text-yellow-600">{display}</span>
        ) : (
          <span className="text-red-600">{display}</span>
        );
      },
      sortingFn: "basic",
    },
    {
      accessorKey: "datetime",
      header: "Время",
      cell: ({ getValue }) => {
        const iso = getValue<string>();
        const date = new Date(iso);
        return format(date, "HH:mm:ss");
      },
      sortingFn: "datetime",
    },
  ];

  if (canActions) {
    columns.push({
      id: "actions",
      header: "Действия",
      cell: ({ row }) => {
        const event = row.original;

        return (
          <div className="flex flex-col gap-2">
            <ConfirmButton eventId={event.id} />
            <RejectButton eventId={event.id} />
          </div>
        );
      },
      enableSorting: false,
      enableColumnFilter: false,
      enableGlobalFilter: false,
    });
  }

  return columns;
};
