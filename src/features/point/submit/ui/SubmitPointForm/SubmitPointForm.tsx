import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@tanstack/react-router";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useCamerasQuery } from "@/entities/camera";
import { useOrganizationsQuery } from "@/entities/organization";
import { Button } from "@/shared/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { submitPointFormSchema } from "../../model/submitPointFormSchema";
import type { PointValues } from "../../model/types";

type Props = {
  onSubmit: (values: PointValues) => void;
  isSuccess: boolean;
  defaultValues?: PointValues;
  isEditing?: boolean;
};

export function SubmitPointForm(props: Props) {
  const router = useRouter();
  const { data: _organizations } = useOrganizationsQuery();
  const { data: cameras } = useCamerasQuery();
  const form = useForm<PointValues>({
    resolver: zodResolver(submitPointFormSchema),
    defaultValues: props.defaultValues,
  });

  const onSubmitHandler = useCallback(
    (values: PointValues) => {
      props.onSubmit(values);
    },
    [props.onSubmit],
  );

  function onNavigateToPoints() {
    router.history.push("/point");
  }

  return props.isSuccess ? (
    <div>
      <p>Точка успешно {props.isEditing ? "обновлена" : "создана"}!</p>
      <Button className="mt-4" onClick={onNavigateToPoints}>
        Все точки
      </Button>
    </div>
  ) : (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitHandler)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Название точки:</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Адрес:</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cameraId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Камера:</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите камеру" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {cameras?.map((camera) => (
                      <SelectItem key={camera.id} value={String(camera.id)}>
                        {camera.serialNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Добавить</Button>
      </form>
    </Form>
  );
}
