import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/shared/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { loginFormSchema, type LoginFormSchema } from '../../model/loginFormSchema';
import { useCallback } from 'react';
import { useRouter } from '@tanstack/react-router';
import { useAppDispatch } from '@/shared/model';
import { loginThunk } from '@/features/session/login/model/login';

type Props = {
	onComplete?: () => void;
};

export function LoginForm(props: Props) {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const form = useForm<LoginFormSchema>({
		resolver: zodResolver(loginFormSchema),
	});

	const onSubmitHandler = useCallback(({ email, password }: LoginFormSchema) => {
		dispatch(loginThunk({ email, password }))
			.unwrap()
			.then(() => props.onComplete?.())
			.catch((error) => {
				form.setError('email', { type: 'server', message: error.message });
			});
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
