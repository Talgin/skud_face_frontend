import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import type { SubmitFormProps } from "@/shared/types";
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
import { batchUserFormSchema } from "../../model/batchUserFormSchema";
import type { BatchUserValues } from "../../model/types";

type Props = SubmitFormProps<BatchUserValues>;

export function SubmitBatchUserForm(props: Props) {
  const form = useForm<BatchUserValues>({
    resolver: zodResolver(batchUserFormSchema),
  });

  const onSubmitHandler = useCallback(
    (values: BatchUserValues) => {
      props.onSubmit(values);
    },
    [props.onSubmit],
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitHandler)} className="space-y-8">
        <FormField
          control={form.control}
          name="excelFile"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Excel файл:</FormLabel>
              <FormControl>
                {/* TODO: Проверить файл на корректность */}
                <Input
                  type="file"
                  accept=".xlsx"
                  onChange={(event) => {
                    const fileList = event.target.files;
                    field.onChange(fileList?.[0] ?? null);
                  }}
                  name={field.name}
                  ref={field.ref}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="photos"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Фото:</FormLabel>
              <FormControl>
                {/* TODO: Проверить файл на корректность */}
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(event) => {
                    field.onChange(event.target.files);
                  }}
                  name={field.name}
                  ref={field.ref}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Создать</Button>
      </form>
    </Form>
  );
}
