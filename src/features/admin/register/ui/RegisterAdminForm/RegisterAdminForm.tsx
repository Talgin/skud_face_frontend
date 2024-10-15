import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type RegisterFormSchema, registerFormSchema } from '../../model/registerFormSchema';
import { useCallback } from 'react';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';

export function RegisterAdminForm() {
	const form = useForm<RegisterFormSchema>({
		resolver: zodResolver(registerFormSchema),
	});

	const onSubmitHandler = useCallback((values: RegisterFormSchema) => {}, []);

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmitHandler)} className="space-y-8">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Имя:</FormLabel>
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
							<FormLabel>Фамилия:</FormLabel>
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
							<FormLabel>Номер карты:</FormLabel>
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
							<FormLabel>Номер телефона:</FormLabel>
							<FormControl>
								<Input {...field} />
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
