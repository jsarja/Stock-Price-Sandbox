import React from 'react';
import { Card, CardHeader, CardBody, CardTitle, Row, Col } from "reactstrap";
import { getLongTerm } from '../api/stockdata';
import Plotter from '../components/Plotter';

class ChartLongterm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			stockSymbol: "",
			startDate: this.formatDate(new Date()),
			endDate: this.formatDate(new Date()),
			averageCheck: false,
			averageMovingCheck: false,
			averageMovingWindow: 10,
			medianCheck: false,
			medianMovingCheck: false,
			medianMovingWindow: 10,
			stdCheck: false,
			stdMovingCheck: false,
			stdMovingWindow: 10,
			minCheck: false,
			minLimit: "",
			minMovingCheck: false,
			minMovingWindow: 10,
			minMovingLimit: "",
			maxCheck: false,
			maxLimit: "",
			maxMovingCheck: false,
			maxMovingWindow: 10,
			maxMovingLimit: "",
			serverError: null,
			plotData: null
		};
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleStockSymbolChange = this.handleStockSymbolChange.bind(this);
		this.handleCheckBoxChange = this.handleCheckBoxChange.bind(this);
		this.formSubmit = this.formSubmit.bind(this);
	}

	handleInputChange(event) {
        this.setState({ [event.target.name]: event.target.value});
	}

	handleCheckBoxChange(event) {
		this.setState({ [event.target.name]: !this.state[event.target.name]})
	}

	handleStockSymbolChange(event) {
		// TODO: Dropdown from server.
        this.setState({ stockSymbol: event.target.value });
	}

	async formSubmit(e) {
		e.preventDefault();
		this.setState({ serverError: null })

		const formMapper = {
			"averageCheck": {"name": "average"},
			"averageMovingCheck": {
				"name": "moving_average", 
				"params": {"window": this.state.averageMovingWindow}
			},
			"medianCheck": {"name": "median"},
			"medianMovingCheck": {
				"name": "moving_median", 
				"params": {"window": this.state.medianMovingWindow}
			},
			"stdCheck": {"name": "std"},
			"stdMovingCheck": {
				"name": "moving_std", 
				"params" : {"window": this.state.stdMovingWindow}
			},
			"minCheck": {"name": "min", "params": {"limit": this.state.minLimit}},
			"minMovingCheck": {
				"name": "moving_min", 
				"params": {
					"limit": this.state.minMovingLimit, 
					"window": this.state.minMovingWindow
				}
			},
			"maxCheck": {"name": "max", "params": {"limit": this.state.maxLimit}},
			"maxMovingCheck": {
				"name": "moving_max", 
				"params": {
					"limit": this.state.maxMovingLimit, 
					"window": this.state.maxMovingWindow
				}
			}
		}
		// Get plot options from the form.
		const plotOptionCheckBoxes = document.querySelectorAll(".plot-option-check");
		const plotOptions = [];
		plotOptionCheckBoxes.forEach(elem => {
			if(elem.checked) {
				const formData = formMapper[elem.name]
				for (var key in formData.params) { 
					if (!formData.params[key]) {
					  	delete formData.params[key];
					}
					else {
						formData.params[key] = parseInt(formData.params[key])
					}
				}
				plotOptions.push(formData);
			}
		})
		
		const requestData = {
			"stock": this.state.stockSymbol,
			"start_date": this.state.startDate,
			"end_date": this.state.endDate,
			"plot_options": plotOptions
		};

		const result = await getLongTerm(requestData);
		const returnData = await result.json();
		if(result.status !== 200) {
			this.setState({ serverError: returnData });
			return;
		}

		const plotData = {
			title: this.state.stockSymbol,
			ydata: { ...returnData.plot_data, prices: returnData.stock_data.prices},
			xdata: returnData.stock_data.dates
		}

		this.setState({plotData})
	}

	formatDate(date) {
		var month = '' + (date.getMonth() + 1);
		var day = '' + date.getDate();
		const year = date.getFullYear();
		if (month.length < 2) 
			month = '0' + month;
		if (day.length < 2) 
			day = '0' + day;
		return [year, month, day].join('-');
	}

	renderPlot() {
		if (!this.state.plotData) {
			return null;
		}
		return (
			<Row>
				<Col md="12">
					<Card>
						<CardHeader>
							<CardTitle tag="h5">Plot</CardTitle>
							
						</CardHeader>
						<CardBody>
							<Plotter 
								title={this.state.plotData.title} 
								xdata={this.state.plotData.xdata} 
								ydata={this.state.plotData.ydata} 
							/>
						</CardBody>
					</Card>
				</Col>
			</Row>
		);
	}
	
	render() {
		return (
			<>
				<Row>
				  	<Col md="12">
						<Card>
							<CardHeader>
								<CardTitle tag="h5">Long-Term</CardTitle>
								<p className="card-category">Get stock's prices with 1 
								day interval for custom date range.</p>
							</CardHeader>
							<CardBody>
								<form onSubmit={this.formSubmit}>
									<div className="text-center mb-4">
									<label >
										<b>Enter stock's symbol(abbreviation) in 
										United States stock market</b>
									</label>
									<input 
										type="text" 
										className="form-control" 
										value={this.state.stockSymbol}
										onChange={this.handleStockSymbolChange}
									/>
									</div>

									<div className="form-group row text-right">
									<label htmlFor="startDate" className="col-2 col-form-label">
										Start Date
									</label>
										<div className="col-10">
											<input 
												className="form-control" 
												type="date" 
												name="startDate"
												id="startDate"
												value={this.state.startDate}
												onChange={this.handleInputChange}
											/>
										</div>
									</div>

									<div className="form-group row text-right">
										<label htmlFor="endDate" className="col-2 col-form-label">
											End date
										</label>
										<div className="col-10">
											<input 
												className="form-control" 
												type="date" 
												name="endDate"
												id="endDate"
												value={this.state.endDate}
												onChange={this.handleInputChange}
											/>
										</div>
									</div>

									<hr/>

									<p>Select helper plots</p>
									
									<Row>
				  						<Col md="6">
											<div className="ml-4 mb-2">
												<input 
													className="form-check-input plot-option-check" 
													type="checkbox" 
													name="averageCheck"
													id="averageCheck"
													checked={this.state.averageCheck}
													onChange={this.handleCheckBoxChange}
												/>
												<label className="form-check-label" htmlFor="averageCheck">
													Average
												</label>
											</div>

											<div className="ml-4 mb-2">
												<input 
													className="form-check-input plot-option-check" 
													type="checkbox" 
													id="averageMovingCheck"
													name="averageMovingCheck"
													checked={this.state.averageMovingCheck}
													onChange={this.handleCheckBoxChange}
												/>
												<label className="form-check-label" htmlFor="averageMovingCheck">
													Moving Average <br/> Window Size: 
													<input 
														className="ml-2"
														type="number" 
														name="averageMovingWindow"
														value={this.state.averageMovingWindow}
														onChange={this.handleInputChange}
														disabled = {!this.state.averageMovingCheck}
													/>		
												</label>
											</div>

											<div className="ml-4 mb-2">
												<input 
													className="form-check-input plot-option-check" 
													type="checkbox" 
													id="medianCheck"
													name="medianCheck"
													checked={this.state.medianCheck}
													onChange={this.handleCheckBoxChange}
												/>
												<label className="form-check-label" htmlFor="medianCheck">
													Median
												</label>
											</div>
											
											<div className="ml-4 mb-2">
												<input 
													className="form-check-input plot-option-check" 
													type="checkbox" 
													id="medianMovingCheck"
													name="medianMovingCheck"
													checked={this.state.medianMovingCheck}
													onChange={this.handleCheckBoxChange}
												/>
												<label className="form-check-label" htmlFor="medianMovingCheck">
													Moving median <br/> Window Size: 
													<input 
														className="ml-2"
														type="number" 
														name="medianMovingWindow"
														value={this.state.medianMovingWindow}
														onChange={this.handleInputChange}
														disabled = {!this.state.medianMovingCheck}
													/>
												</label>
											</div>

											<div className="ml-4 mb-2">
												<input 
													className="form-check-input plot-option-check" 
													type="checkbox" 
													id="stdCheck" 
													name="stdCheck"
													checked={this.state.stdCheck}
													onChange={this.handleCheckBoxChange}
												/>
												<label className="form-check-label" htmlFor="stdCheck">
													Standard deviation
												</label>
											</div>
											
											<div className="ml-4 mb-2">
												<input 
													className="form-check-input plot-option-check" 
													type="checkbox" 
													id="stdMovingCheck"
													name="stdMovingCheck"
													checked={this.state.stdMovingCheck}
													onChange={this.handleCheckBoxChange}
												/>
												<label className="form-check-label" htmlFor="stdMovingCheck">
													Moving standard deviation <br/> Window Size: 
													<input 
														className="ml-2"
														type="number" 
														name="stdMovingWindow"
														value={this.state.stdMovingWindow}
														onChange={this.handleInputChange}
														disabled = {!this.state.stdMovingCheck}
													/>
												</label>
											</div>
										</Col>
										<Col md="6">
											<div className="ml-4 mb-2">
												<input 
													className="form-check-input plot-option-check" 
													type="checkbox" 
													id="minCheck" 
													name="minCheck"
													checked={this.state.minCheck}
													onChange={this.handleCheckBoxChange}
												/>
												<label className="form-check-label" htmlFor="minCheck">
													Minimum <br/> (Optional) Bottom: 
													<input 
														className="ml-2"
														type="number" 
														name="minLimit"
														value={this.state.minLimit}
														onChange={this.handleInputChange}
														disabled = {!this.state.minCheck}
													/> %
												</label>
											</div>
											
											<div className="ml-4 mb-2">
												<input 
													className="form-check-input plot-option-check" 
													type="checkbox" 
													name="minMovingCheck"
													id="minMovingCheck"
													checked={this.state.minMovingCheck}
													onChange={this.handleCheckBoxChange}
												/>
												<label className="form-check-label" htmlFor="minMovingCheck">
													Moving minimum <br/> Window Size: 
													<input 
														className="ml-2 mb-1"
														type="number" 
														name="minMovingWindow"
														value={this.state.minMovingWindow}
														onChange={this.handleInputChange}
														disabled = {!this.state.minMovingCheck}
													/>
													<br/> (Optional) Bottom: 
													<input 
														className="ml-2"
														type="number" 
														name="minMovingLimit"
														value={this.state.minMovingLimit}
														onChange={this.handleInputChange}
														disabled = {!this.state.minMovingCheck}
													/> %
												</label>
											</div>

											<div className="ml-4 mb-2">
												<input 
													className="form-check-input plot-option-check" 
													type="checkbox" 
													id="maxCheck"
													name="maxCheck"
													checked={this.state.maxCheck}
													onChange={this.handleCheckBoxChange}
												/>
												<label className="form-check-label" htmlFor="maxCheck">
													Maximum <br/> (Optional) Top: 
													<input 
														className="ml-2"
														type="number" 
														name="maxLimit"
														value={this.state.maxLimit}
														onChange={this.handleInputChange}
														disabled = {!this.state.maxCheck}
													/> %
												</label>
											</div>

											<div className="ml-4">
												<input 
													className="form-check-input plot-option-check" 
													type="checkbox" 
													id="maxMovingCheck"
													name="maxMovingCheck"
													checked={this.state.maxMovingCheck}
													onChange={this.handleCheckBoxChange}
												/>
												<label className="form-check-label" htmlFor="maxMovingCheck">
													Moving maximum <br/> Window Size: 
													<input 
														className="ml-2 mb-1"
														type="number" 
														name="maxMovingWindow"
														value={this.state.maxMovingWindow}
														onChange={this.handleInputChange}
														disabled = {!this.state.maxMovingCheck}
													/>
													<br/> (Optional) Top: 
													<input 
														className="ml-2"
														type="number" 
														name="maxMovingLimit"
														value={this.state.maxMovingLimit}
														onChange={this.handleInputChange}
														disabled = {!this.state.maxMovingCheck}
													/> %
												</label>
											</div>
										</Col>
									</Row>
									<p className="text-danger font-weight-bold text-uppercase">
										{this.state.serverError}
									</p>
									<button type="submit" className="btn btn-primary btn-lg btn-block">Get Data!</button>
								</form>
							</CardBody>
						</Card>
					</Col>
				</Row>
				{this.renderPlot()}
			</>
		);
	}
}

export default ChartLongterm;