import { useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/shared/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { loginFormSchema, type LoginFormSchema } from '../../model/loginFormSchema';
import { useLoginMutation } from '@/entities/session';
import { useAppDispatch } from '@/shared/model';
import { loginThunk } from '@/features/session/login';
import { PasswordInput } from '@/shared/ui/password-input';

type Props = {
	onComplete?: () => void;
};

export function LoginForm(props: Props) {
	const dispatch = useAppDispatch();
	const [login, { isLoading }] = useLoginMutation();
	const form = useForm<LoginFormSchema>({
		resolver: zodResolver(loginFormSchema),
	});

	const onSubmitHandler = useCallback(({ username, password }: LoginFormSchema) => {
		dispatch(loginThunk({ username, password }))
			.unwrap()
			.then(() => props.onComplete?.())
			.catch((error) => {
				form.setError('username', { type: 'server', message: '' });
				form.setError('password', { type: 'server', message: error.message });
			});
	}, []);

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmitHandler)} className="space-y-8">
				<FormField
					control={form.control}
					name="username"
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
								<PasswordInput placeholder="Введите пароль" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit" disabled={isLoading}>
					{isLoading ? <Loader2 className="animate-spin" /> : <span>Войти</span>}
				</Button>
			</form>
		</Form>
	);
}
