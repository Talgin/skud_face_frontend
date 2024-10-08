import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@/shared/ui/button';

export const Route = createFileRoute('/')({
	component: HomeComponent,
});

function HomeComponent() {
	function onClick() {
		alert('clicked!');
	}

	return (
		<div className="p-2">
			<Button onClick={onClick}>Click me!</Button>
		</div>
	);
}
