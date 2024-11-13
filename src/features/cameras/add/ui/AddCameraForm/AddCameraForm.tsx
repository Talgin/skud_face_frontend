import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type AddCameraFormSchema, addCameraFormSchema } from '../../model/addCameraFormSchema';
import { useCallback } from 'react';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { Calendar } from '@/shared/ui/calendar';
import { cn } from '@/shared/lib/shadcn-ui/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Checkbox } from '@/shared/ui/checkbox';

export function AddCameraForm() {
	const form = useForm<AddCameraFormSchema>({
		resolver: zodResolver(addCameraFormSchema),
	});

	const onSubmitHandler = useCallback((values: AddCameraFormSchema) => {}, []);

	return (
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
											{field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
											<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
										</Button>
									</FormControl>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0" align="start">
									<Calendar
										mode="single"
										selected={field.value}
										onSelect={field.onChange}
										disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
										initialFocus
									/>
								</PopoverContent>
							</Popover>

							<FormMessage />
						</FormItem>
					)}
				/>
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
				<FormField
					control={form.control}
					name="pointId"
					render={({ field }) => (
						<FormItem>
							<FormLabel>ИД точки:</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="pointId"
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
