import React, { Component } from "react";
import { Link } from "react-router-dom";

import { signIn } from '../../api/authentication';

export default class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = { username: '', password: '', userError: '', passError: '',
      otherError: ''};
    this.handleInputChange = this.handleInputChange.bind(this);
    this.formSubmit = this.formSubmit.bind(this);
  }

  handleInputChange(event) {
    this.setState({ [event.target.name]: event.target.value});
  }

  formSubmit = async (e) => {
    e.preventDefault();
    this.setState({userError: '', passError: ''})
    const {username, password } = this.state;
    const result = await signIn({username, password});
    const returnData = await result.json();
    if(result.status === 200) {
      console.log(returnData);
    }
    else {
        const userError = 'username' in returnData ? returnData['username']  : '';
        const passError = 'password' in returnData ? returnData['password'] : '';
        const otherError = 'non_field_errors' in returnData ? returnData['non_field_errors'] : '';
        this.setState({userError, passError, otherError });
        console.log(returnData)
    }
}

  render() {
    return (
      <div className="row">
        <div className="col-md-8 offset-md-2 col-lg-6 offset-lg-3">
          <div className="card-stats card">
            <div className="card-body">
              <form onSubmit={this.formSubmit}>
                <h3>Sign In</h3>

                <div className="form-group">
                  <label>Username</label>
                  <input 
                    name="username"
                    value={this.state.username}
                    onChange={this.handleInputChange}
                    type="text" 
                    className="form-control"/>
                </div>
                <p className="text-danger font-weight-bold text-uppercase">
                  {this.state.userError}
                </p>

                <div className="form-group">
                  <label>Password</label>
                  <input 
                    name="password"
                    value={this.state.password}
                    onChange={this.handleInputChange}
                    type="password" 
                    className="form-control" 
                  />
                </div>
                <p className="text-danger font-weight-bold text-uppercase">
                  {this.state.passError}
                </p>

                <p className="text-danger font-weight-bold text-uppercase">
                  {this.state.otherError}
                </p>
                <button type="submit" className="btn btn-primary btn-block">Submit</button>
                <p className="forgot-password text-right">
                  Don't have an account yet? <Link to="/sign-up">Register here!</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}