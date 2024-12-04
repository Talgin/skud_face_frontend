import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { submitPointFormSchema } from '../../model/submitPointFormSchema';
import { useCallback, useEffect, useState } from 'react';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { type Cameras, getCameras } from '@/entities/cameras';
import { useOrganizationsQuery } from '@/entities/organization';
import type { PointValues } from '../../model/types';
import { useRouter } from '@tanstack/react-router';

type Props = {
	onSubmit: (values: PointValues) => void;
	isSuccess: boolean;
	isLoading: boolean;
	successMessage: string;
	defaultValues?: PointValues;
	isEditing?: boolean;
};

export function SubmitPointForm(props: Props) {
	const router = useRouter();
	const [cameras, setCameras] = useState<Cameras>([]);
	const { data: organizations } = useOrganizationsQuery();
	const form = useForm<PointValues>({
		resolver: zodResolver(submitPointFormSchema),
		defaultValues: props.defaultValues,
	});

	const onSubmitHandler = useCallback((values: PointValues) => {
		props.onSubmit(values);
	}, []);

	async function fetchCameras() {
		const camerasResponse = await getCameras();
		setCameras(camerasResponse);
	}

	useEffect(() => {
		fetchCameras();
	}, []);

	function onNavigateToPoints() {
		router.history.push('/point');
	}

	return props.isSuccess ? (
		<div>
			<p>Точка успешно {props.isEditing ? 'обновлена' : 'создана'}!</p>
			<Button className="mt-4" onClick={onNavigateToPoints}>
				Все точки
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
							<FormLabel>Название точки:</FormLabel>
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
					name="cameraId"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Камера:</FormLabel>
							<FormControl>
								<Select onValueChange={field.onChange} defaultValue={field.value}>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Выберите камеру" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{cameras.map((camera) => (
											<SelectItem key={camera.id} value={camera.id}>
												{camera.serialNumber}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="organizationId"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Организация:</FormLabel>
							<FormControl>
								<Select onValueChange={field.onChange} defaultValue={field.value}>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Выберите организацию" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{organizations?.map((organization) => (
											<SelectItem key={organization.id} value={String(organization.id)}>
												{organization.organizationName}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit">Добавить</Button>
			</form>
		</Form>
	);
}
