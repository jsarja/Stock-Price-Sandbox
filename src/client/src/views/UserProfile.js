import React from 'react';
import { Card, CardHeader, CardBody, CardTitle, Row, Col } from "reactstrap";
import { getApiKey, setApiKey } from '../api/apiKeys';

class UserProfile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {apiKey: ""};
		this.handleInputChange = this.handleInputChange.bind(this);
		this.formSubmit = this.formSubmit.bind(this);
	}
	

	async componentDidMount() {
		const result = await getApiKey();
		const data = await result.json();
		this.setState({ apiKey: data.key});
	}

	handleInputChange(event) {
		this.setState({ apiKey: event.target.value});
	}

	async formSubmit(e) {
		e.preventDefault();
		await setApiKey(this.state.apiKey);
		window.location.reload();
	}

	render() {
		return (
			<>
				<Row>
				  <Col md="12">
					<Card>
					  <CardHeader>
						<CardTitle tag="h5">User Settings:</CardTitle>
					  </CardHeader>
					  <CardBody>
						  <form onSubmit={this.formSubmit}>
							<div className="form-group">
								<label >Alpha Vantage API Key:</label>
								<input 
									type="text" 
									className="form-control" 
									aria-describedby="avKeylHelp" 
									value={this.state.apiKey}
                    				onChange={this.handleInputChange}
								/>
								<small id="avKeylHelp" className="form-text text-muted">
                                    Claim your API Key 
                                    from <a target="_blank" rel="noopener noreferrer" 
                                    href="https://www.alphavantage.co/support/#api-key"> 
                                    Alpha Vantage's Site</a>
								</small>
							</div>
							<button type="submit" className="btn btn-primary">Update API Key</button>
						  </form>
					  </CardBody>
					</Card>
				  </Col>
				</Row>
				
			</>
		  );
	}
}

export default UserProfile;