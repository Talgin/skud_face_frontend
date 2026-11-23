import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@tanstack/react-router";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { CAMERA_MODEL_KEYS, CAMERA_MODEL_LABELS } from "@/entities/camera";
import { usePointsQuery } from "@/entities/point";
import { dateLocale, t } from "@/shared/i18n";
import { cn } from "@/shared/lib/shadcn-ui/utils";
import { Button } from "@/shared/ui/button";
import { Calendar } from "@/shared/ui/calendar";
import { Checkbox } from "@/shared/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import {
  addCameraFormSchema,
  updateCameraFormSchema,
} from "../../model/submitCameraFormSchema";
import type { CameraValues } from "../../model/types";

type Props = {
  onSubmit: (values: CameraValues) => void;
  isSuccess: boolean;
  defaultValues?: CameraValues;
  isEditing?: boolean;
};

export function SubmitCameraForm(props: Props) {
  const router = useRouter();
  const { data: points } = usePointsQuery();
  const form = useForm<CameraValues>({
    resolver: zodResolver(
      props.isEditing ? updateCameraFormSchema : addCameraFormSchema,
    ),
    defaultValues: props.defaultValues ?? { models: ["face"] },
  });

  const onSubmitHandler = useCallback(
    (values: CameraValues) => {
      props.onSubmit(values);
    },
    [props.onSubmit],
  );

  function onNavigateToCameras() {
    router.history.push("/camera");
  }

  return props.isSuccess ? (
    <div>
      <p>
        {props.isEditing
          ? t("Камера успешно обновлена!")
          : t("Камера успешно создана!")}
      </p>
      <Button className="mt-4" onClick={onNavigateToCameras}>
        {t("Все камеры")}
      </Button>
    </div>
  ) : (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitHandler)} className="space-y-8">
        <FormField
          control={form.control}
          name="serialNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Серийный номер:")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="brandName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Название бренда:")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="modelName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Название модели:")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="registrationDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>{t("Дата регистрации:")}</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP", {
                          locale: dateLocale(),
                        })
                      ) : (
                        <span>{t("Выберите дату")}</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    locale={dateLocale()}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                  />
                </PopoverContent>
              </Popover>

              <FormMessage />
            </FormItem>
          )}
        />
        {props.isEditing && (
          <FormField
            control={form.control}
            name="isActivated"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{t("Активировать:")}</FormLabel>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {props.isEditing && (
          <FormField
            control={form.control}
            name="pointId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Точка:")}</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={String(field.value)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("Выберите точку")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {points?.map((point) => (
                        <SelectItem key={point.id} value={String(point.id)}>
                          {point.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Ссылка:")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="models"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Модели:")}</FormLabel>
              <div className="flex flex-col gap-2">
                {CAMERA_MODEL_KEYS.map((key) => {
                  const selected = field.value ?? [];
                  const id = `camera-model-${key}`;
                  return (
                    <div key={key} className="flex items-center gap-2">
                      <FormControl>
                        <Checkbox
                          id={id}
                          checked={selected.includes(key)}
                          onCheckedChange={(checked) =>
                            field.onChange(
                              CAMERA_MODEL_KEYS.filter((k) =>
                                k === key
                                  ? checked === true
                                  : selected.includes(k),
                              ),
                            )
                          }
                        />
                      </FormControl>
                      <label htmlFor={id} className="text-sm cursor-pointer">
                        {CAMERA_MODEL_LABELS[key]}
                      </label>
                    </div>
                  );
                })}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">
          {props.isEditing ? t("Сохранить") : t("Создать")}
        </Button>
      </form>
    </Form>
  );
}
