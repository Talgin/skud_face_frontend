import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Button } from '@/shared/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Input } from '@/shared/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { cn } from '@/shared/lib/shadcn-ui/utils';
import { Calendar } from '@/shared/ui/calendar';
import { SubmitFormProps } from '@/shared/types';
import { editUserFormSchema, userFormSchema } from '../../model/userFormSchema';
import type { UserValues } from '../../model/types';
import { Checkbox } from '@/shared/ui/checkbox';
import { ru } from 'date-fns/locale';
import { useRouter } from '@tanstack/react-router';
import { User } from '@/entities/user/model/types';

type Props = Omit<SubmitFormProps<UserValues>, 'defaultValues'> & {
	defaultValues?: User;
};

export function SubmitUserForm(props: Props) {
	const router = useRouter();
	const form = useForm<UserValues>({
		resolver: zodResolver(props.isEditing ? editUserFormSchema : userFormSchema),
		defaultValues: props.defaultValues,
	});
	const [filename, setFilename] = useState<string | undefined>(undefined);

	const onSubmitHandler = useCallback((values: UserValues) => {
		props.onSubmit(values);
	}, []);

	function onNavigate() {
		router.history.push('/user');
	}

	return props.isSuccess ? (
		<div>
			<p>Пользователь успешно {props.isEditing ? 'обновлён' : 'создан'}!</p>
			<Button className="mt-4" onClick={onNavigate}>
				Все пользователи
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
					name="gender"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Выберите пол:</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Выберите пол:" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="male">Мужчина</SelectItem>
									<SelectItem value="female">Женщина</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="birthDate"
					render={({ field }) => (
						<FormItem className="flex flex-col">
							<FormLabel>Дата рождения:</FormLabel>
							<Popover>
								<PopoverTrigger asChild>
									<FormControl>
										<Button
											variant={'outline'}
											className={cn('w-[240px] pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
										>
											{field.value ? (
												format(field.value, 'PPP', {
													locale: ru,
												})
											) : (
												<span>Выбериите дату</span>
											)}
											<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
										</Button>
									</FormControl>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0" align="start">
									<Calendar
										mode="single"
										selected={field.value}
										onSelect={field.onChange}
										locale={ru}
										disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
										captionLayout="dropdown"
										fromYear={1912}
										toYear={new Date().getFullYear()}
									/>
								</PopoverContent>
							</Popover>

							<FormMessage />
						</FormItem>
					)}
				/>
				{props.isEditing ? <img src={props.defaultValues?.photoPath} alt="photo" /> : null}
				<FormField
					control={form.control}
					name="photo"
					render={({ field }) => {
						return (
							<FormItem>
								<FormLabel>Фото:</FormLabel>
								<FormControl>
									<Input
										type="file"
										name="photo"
										value={filename}
										onChange={(e) => {
											setFilename(e.target.value);
											field.onChange(e.target.files);
										}}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						);
					}}
				/>
				{props.isEditing ? (
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
				) : null}
				<Button type="submit">Создать</Button>
			</form>
		</Form>
	);
}
