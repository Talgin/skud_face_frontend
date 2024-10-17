import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type CreateUsersFormSchema, createUsersFormSchema } from '../../model/createUsersFormSchema';
import { useCallback } from 'react';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';

export function CreateUsersForm() {
	const form = useForm<CreateUsersFormSchema>({
		resolver: zodResolver(createUsersFormSchema),
	});

	const onSubmitHandler = useCallback((values: CreateUsersFormSchema) => {}, []);

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
								<Input type="file" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="photo"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Фото:</FormLabel>
							<FormControl>
								<Input type="file" {...field} />
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
