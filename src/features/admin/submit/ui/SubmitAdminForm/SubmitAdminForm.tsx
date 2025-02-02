import { useRouter } from '@tanstack/react-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { SubmitFormProps } from '@/shared/types';
import { submitAdminFormSchema } from '../../model/submitAdminFormSchema';
import type { AdminValues } from '../../model/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Checkbox } from '@/shared/ui/checkbox';
import { PasswordInput } from '@/shared/ui/password-input';

type Props = SubmitFormProps<AdminValues>;

export function SubmitAdminForm(props: Props) {
	const router = useRouter();
	const form = useForm<AdminValues>({
		resolver: zodResolver(submitAdminFormSchema),
		defaultValues: props.defaultValues,
	});

	const onSubmitHandler = useCallback((values: AdminValues) => {
		props.onSubmit(values);
	}, []);

	function onNavigate() {
		router.history.push('/admin');
	}

	return props.isSuccess ? (
		<div>
			<p>Админ успешно {props.isEditing ? 'обновлен' : 'создан'}!</p>
			<Button className="mt-4" onClick={onNavigate}>
				Все админы
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
					name="role"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Роль:</FormLabel>
							<FormControl>
								<Select onValueChange={field.onChange} defaultValue={field.value}>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Выберите роль" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="admin">admin</SelectItem>
										<SelectItem value="operator">operator</SelectItem>
										<SelectItem value="registrar">registrar</SelectItem>
										<SelectItem value="super_admin">super admin</SelectItem>
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
							<FormLabel>Имя пользователя:</FormLabel>
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
							<FormLabel>Пароль пользователя:</FormLabel>
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
							<FormLabel>Активировать:</FormLabel>
							<FormControl>
								<Checkbox checked={field.value} onCheckedChange={field.onChange} />
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
