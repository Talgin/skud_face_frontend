import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { AddPointForm } from '@/features/points/add';

export function AddPointPage() {
	return (
		<div className="container flex justify-center pt-16">
			<Card className="xl:w-6/12 w-full">
				<CardHeader>
					<CardTitle>Добавить точку</CardTitle>
				</CardHeader>
				<CardContent>
					<AddPointForm />
				</CardContent>
			</Card>
		</div>
	);
}
