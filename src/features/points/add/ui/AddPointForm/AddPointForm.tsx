import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type AddPointFormSchema, addPointFormSchema } from '../../model/addPointFormSchema';
import { useCallback, useEffect, useState } from 'react';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { type Cameras, getCameras } from '@/entities/cameras';
import { type Organizations, getOrganizations } from '@/entities/organization';

export function AddPointForm() {
	const [cameras, setCameras] = useState<Cameras>([]);
	const [organizations, setOrganizations] = useState<Organizations>([]);
	const form = useForm<AddPointFormSchema>({
		resolver: zodResolver(addPointFormSchema),
	});

	const onSubmitHandler = useCallback((values: AddPointFormSchema) => {}, []);

	async function fetchCameras() {
		const camerasResponse = await getCameras();
		setCameras(camerasResponse);
	}

	async function fetchOrganizations() {
		const organizationsResponse = await getOrganizations();
		setOrganizations(organizationsResponse);
	}

	useEffect(() => {
		fetchCameras();
		fetchOrganizations();
	}, []);

	return (
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
					name="camera_id"
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
					name="camera_id"
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
										{organizations.map((organization) => (
											<SelectItem key={organization.id} value={organization.id}>
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
