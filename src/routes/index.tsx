import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Button, Col, Row, Typography } from 'antd';

const { Title } = Typography;

export const Route = createFileRoute('/')({
	component: HomeComponent,
});

function HomeComponent() {
	function onClick() {
		alert('clicked!');
	}

	return (
		<div className="p-2">
			<Row>
				<Col>
					<Title level={2}>Skud Face</Title>
					<Button onClick={onClick}>Click me!</Button>
				</Col>
			</Row>
		</div>
	);
}
