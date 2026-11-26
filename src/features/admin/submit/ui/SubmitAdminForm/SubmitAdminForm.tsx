import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@tanstack/react-router";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useOrganizationsQuery } from "@/entities/organization";
import { t } from "@/shared/i18n";
import type { SubmitFormProps } from "@/shared/types";
import { Button } from "@/shared/ui/button";
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
import { PasswordInput } from "@/shared/ui/password-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import {
  editAdminFormSchema,
  submitAdminFormSchema,
} from "../../model/submitAdminFormSchema";
import type { AdminValues } from "../../model/types";

type Props = SubmitFormProps<AdminValues>;

export function SubmitAdminForm(props: Props) {
  const router = useRouter();
  const form = useForm<AdminValues>({
    resolver: zodResolver(
      props.isEditing ? editAdminFormSchema : submitAdminFormSchema,
    ),
    defaultValues: props.defaultValues,
  });

  const { data: organizations } = useOrganizationsQuery();

  const onSubmitHandler = useCallback(
    (values: AdminValues) => {
      props.onSubmit(values);
    },
    [props.onSubmit],
  );

  function onNavigate() {
    router.history.push("/admin");
  }

  return props.isSuccess ? (
    <div>
      <p>
        {props.isEditing
          ? t("Админ успешно обновлен!")
          : t("Админ успешно создан!")}
      </p>
      <Button className="mt-4" onClick={onNavigate}>
        {t("Все админы")}
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
              <FormLabel>{t("Имя:")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="surname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Фамилия:")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cardId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Номер карты:")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="organizationId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Организация:")}</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  defaultValue={field.value?.toString() ?? ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("Выберите организацию")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {organizations?.map((organization) => (
                      <SelectItem
                        key={organization.id}
                        value={String(organization.id)}
                      >
                        {organization.organizationName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Роль:")}</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("Выберите роль")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="admin">{t("Администратор")}</SelectItem>
                    <SelectItem value="operator">{t("Оператор")}</SelectItem>
                    <SelectItem value="registrar">
                      {t("Регистратор")}
                    </SelectItem>
                    <SelectItem value="super_admin">
                      {t("Суперадминистратор")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Имя пользователя:")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Пароль пользователя:")}</FormLabel>
              <FormControl>
                <PasswordInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isActive"
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
        <Button type="submit">{t("Создать")}</Button>
      </form>
    </Form>
  );
}
