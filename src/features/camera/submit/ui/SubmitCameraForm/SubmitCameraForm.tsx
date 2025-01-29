import { useRouter } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateCameraFormSchema, addCameraFormSchema } from '../../model/submitCameraFormSchema';
import { useCallback } from 'react';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { Calendar } from '@/shared/ui/calendar';
import { cn } from '@/shared/lib/shadcn-ui/utils';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { Checkbox } from '@/shared/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { usePointsQuery } from '@/entities/point';
import type { CameraValues } from '../../model/types';

type Props = {
	onSubmit: (values: CameraValues) => void;
	isSuccess: boolean;
	defaultValues?: CameraValues;
	isEditing?: boolean;
};

export function SubmitCameraForm(props: Props) {
	const router = useRouter();
	const { data: points } = usePointsQuery();
	const form = useForm<CameraValues>({
		resolver: zodResolver(props.isEditing ? updateCameraFormSchema : addCameraFormSchema),
		defaultValues: props.defaultValues,
	});

	const onSubmitHandler = useCallback((values: CameraValues) => {
		props.onSubmit(values);
	}, []);

	function onNavigateToCameras() {
		router.history.push('/camera');
	}

	return props.isSuccess ? (
		<div>
			<p>Камера успешно {props.isEditing ? 'обновлена' : 'создана'}!</p>
			<Button className="mt-4" onClick={onNavigateToCameras}>
				Все камеры
			</Button>
		</div>
	) : (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmitHandler)} className="space-y-8">
				<FormField
					control={form.control}
					name="serialNumber"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Серийный номер:</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="brandName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Название бренда:</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="modelName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Название модели:</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="registrationDate"
					render={({ field }) => (
						<FormItem className="flex flex-col">
							<FormLabel>Дата регистрации:</FormLabel>
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
									/>
								</PopoverContent>
							</Popover>

							<FormMessage />
						</FormItem>
					)}
				/>
				{props.isEditing && (
					<FormField
						control={form.control}
						name="isActivated"
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
				)}
				{props.isEditing && (
					<FormField
						control={form.control}
						name="pointId"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Точка:</FormLabel>
								<FormControl>
									<Select onValueChange={field.onChange} defaultValue={String(field.value)}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Выберите точку" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{points?.map((point) => (
												<SelectItem key={point.id} value={String(point.id)}>
													{point.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				)}
				<FormField
					control={form.control}
					name="url"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Ссылка:</FormLabel>
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
