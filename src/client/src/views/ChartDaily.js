import React from 'react';
import { Card, CardHeader, CardBody, CardTitle, Row, Col } from "reactstrap";

class ChartDaily extends React.Component {
	render() {
		return (
			<>
				<Row>
				  <Col lg={{size: 10, offset: 1}} md="12">
					<Card className="card-stats">
					  <CardBody>
						  PlaceHolder
					  </CardBody>
					</Card>
				  </Col>
				</Row>
				<Row>
				  <Col md="12">
					<Card>
					  <CardHeader>
						<CardTitle tag="h5">PlaceHolder</CardTitle>
						<p className="card-category">PlaceHolder</p>
					  </CardHeader>
					  <CardBody>
						  PlaceHolder
					  </CardBody>
					</Card>
				  </Col>
				</Row>
				<Row>
				  <Col md="12">
					<Card>
					  <CardHeader>
						<CardTitle tag="h5">PlaceHolder</CardTitle>
						<p className="card-category">PlaceHolder</p>
					  </CardHeader>
					  <CardBody>
						  PlaceHolder
					  </CardBody>
					</Card>
				  </Col>
				</Row>
			</>
		  );
	}
}

export default ChartDaily;