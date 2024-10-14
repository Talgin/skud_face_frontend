import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/shared/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { loginFormSchema, type LoginFormSchema } from '../../model/loginFormSchema';
import { useCallback } from 'react';
import Cookie from 'js-cookie';
import { ACCESS_TOKEN } from '@/entities/session';
import { useRouter } from '@tanstack/react-router';

export function LoginForm() {
	const router = useRouter();
	const form = useForm<LoginFormSchema>({
		resolver: zodResolver(loginFormSchema),
	});

	const onSubmitHandler = useCallback((values: LoginFormSchema) => {
		// TODO: replace the value with an access token
		Cookie.set(ACCESS_TOKEN, 'asd12345');
		router.history.push('/organization');
	}, []);

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmitHandler)} className="space-y-8">
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input type="email" placeholder="Введите электронную почту" {...field} />
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
							<FormLabel>Пароль</FormLabel>
							<FormControl>
								<Input type="password" placeholder="Введите пароль" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit">Войти</Button>
			</form>
		</Form>
	);
}
