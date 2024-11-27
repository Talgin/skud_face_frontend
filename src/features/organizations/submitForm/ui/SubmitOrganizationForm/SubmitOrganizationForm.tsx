import { useCallback } from 'react';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { useRouter } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { submitOrganizationFormSchema } from '../../model/submitOrganizationFormSchema';
import type { OrganizationValues } from '../../model/types';

type Props = {
	onSubmit: (values: OrganizationValues) => void;
	isSuccess: boolean;
	isLoading: boolean;
	successMessage: string;
};

export function SubmitOrganizationForm(props: Props) {
	const router = useRouter();

	const form = useForm<OrganizationValues>({
		resolver: zodResolver(submitOrganizationFormSchema),
	});

	function onNavigateToAllOrgnization() {
		router.history.push('/organization');
	}

	return props.isSuccess ? (
		<div>
			<p>Организация успешно создана!</p>
			<Button className="mt-4" onClick={onNavigateToAllOrgnization}>
				Все организаций
			</Button>
		</div>
	) : (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(props.onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="organizationName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Название организации:</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="ceoName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Имя руководителя:</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="address"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Адрес:</FormLabel>
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
				<Button type="submit" disabled={props.isLoading}>
					{props.isLoading ? (
						<div className="flex flex-col justify-center">
							<Loader2 className="animate-spin mr-2" />
						</div>
					) : (
						<span>Добавить</span>
					)}
				</Button>
			</form>
		</Form>
	);
}
