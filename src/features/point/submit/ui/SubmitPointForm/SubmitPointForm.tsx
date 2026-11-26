import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@tanstack/react-router";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useCamerasQuery } from "@/entities/camera";
import { useOrganizationsQuery } from "@/entities/organization";
import { useCan } from "@/entities/role";
import { t } from "@/shared/i18n";
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
  const { canAny } = useCan();
  // a super admin (no organization of their own) chooses the point's organization
  const chooseOrg = canAny("org.view") && !props.isEditing;
  const { data: organizations } = useOrganizationsQuery(undefined, {
    skip: !chooseOrg,
  });
  const { data: cameras } = useCamerasQuery(undefined, {
    skip: !canAny("camera.view"),
  });
  const form = useForm<PointValues>({
    resolver: zodResolver(submitPointFormSchema),
    defaultValues: props.defaultValues,
  });

  const onSubmitHandler = useCallback(
    (values: PointValues) => {
      if (chooseOrg && !values.organizationId) {
        form.setError("organizationId", { message: t("Выберите организацию") });
        return;
      }
      props.onSubmit(values);
    },
    [props.onSubmit, chooseOrg, form.setError],
  );

  function onNavigateToPoints() {
    router.history.push("/point");
  }

  return props.isSuccess ? (
    <div>
      <p>
        {props.isEditing
          ? t("Точка успешно обновлена!")
          : t("Точка успешно создана!")}
      </p>
      <Button className="mt-4" onClick={onNavigateToPoints}>
        {t("Все точки")}
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
              <FormLabel>{t("Название точки:")}</FormLabel>
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
              <FormLabel>{t("Адрес:")}</FormLabel>
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
              <FormLabel>{t("Камера:")}</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("Выберите камеру")} />
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
        {chooseOrg && (
          <FormField
            control={form.control}
            name="organizationId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Организация:")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("Выберите организацию")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {organizations?.map((org) => (
                      <SelectItem key={org.id} value={String(org.id)}>
                        {org.organizationName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button type="submit">
          {props.isEditing ? t("Сохранить") : t("Добавить")}
        </Button>
      </form>
    </Form>
  );
}
