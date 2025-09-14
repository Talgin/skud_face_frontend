import { format } from "date-fns";
import { Button } from "@/shared/ui/button";
import { Calendar } from "@/shared/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";

export function DateFilter({
  value,
  onChange,
}: {
  value?: Date;
  onChange: (d: Date) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          {value ? format(value, "dd.MM.yyyy HH:mm") : "Выбрать дату"}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-3">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(d) => d && onChange(d)}
          captionLayout="dropdown"
        />
      </PopoverContent>
    </Popover>
  );
}
