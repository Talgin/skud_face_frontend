import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
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
import { submitOrganizationFormSchema } from "../../model/submitOrganizationFormSchema";
import type { OrganizationValues } from "../../model/types";

type Props = {
  onSubmit: (values: OrganizationValues) => void;
  isSuccess: boolean;
  isLoading: boolean;
  successMessage: string;
  defaultValues?: OrganizationValues;
  isEditing?: boolean;
};

export function SubmitOrganizationForm(props: Props) {
  const router = useRouter();

  const form = useForm<OrganizationValues>({
    resolver: zodResolver(submitOrganizationFormSchema),
    defaultValues: props.defaultValues,
  });

  function onNavigateToAllOrganization() {
    router.history.push("/organization");
  }

  return props.isSuccess ? (
    <div>
      <p>
        {props.isEditing
          ? t("Организация успешно обновлена!")
          : t("Организация успешно создана!")}
      </p>
      <Button className="mt-4" onClick={onNavigateToAllOrganization}>
        {t("Все организации")}
      </Button>
    </div>
  ) : (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(props.onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="organizationName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Название организации:")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ceoName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Имя руководителя:")}</FormLabel>
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
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Номер телефона:")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={props.isLoading}>
          {props.isLoading ? (
            <div className="flex flex-col justify-center">
              <Loader2 className="animate-spin mr-2" />
            </div>
          ) : props.isEditing ? (
            <span>{t("Изменить")}</span>
          ) : (
            <span>{t("Добавить")}</span>
          )}
        </Button>
      </form>
    </Form>
  );
}
