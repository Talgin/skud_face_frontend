import React from "react";
import { Button, Col, Row, Typography } from 'antd';

const { Title } = Typography;

function App() {
  function onClick() {
    alert('clicked!')
  }

	return (
	  <Row>
      <Col>
        <Title level={2}>Skud Face</Title>
        <Button onClick={onClick}>Click me!</Button>
      </Col>
    </Row>
	);
}

export default App;
