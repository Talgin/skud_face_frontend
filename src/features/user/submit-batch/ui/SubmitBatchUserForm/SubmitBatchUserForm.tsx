import { useCallback } from 'react';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { SubmitFormProps } from '@/shared/types';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { batchUserFormSchema } from '../../model/batchUserFormSchema';
import type { BatchUserValues } from '../../model/types';

type Props = SubmitFormProps<BatchUserValues>;

export function SubmitBatchUserForm(props: Props) {
	const form = useForm<BatchUserValues>({
		resolver: zodResolver(batchUserFormSchema),
	});

	const onSubmitHandler = useCallback((values: BatchUserValues) => {
		props.onSubmit(values);
	}, []);

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
								<Input type="file" accept=".xlsx" {...field} />
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
								<Input type="file" multiple accept="image/*" {...field} />
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
