import React, { Component } from "react";
import { Link } from "react-router-dom";

import { signUp } from '../../api/authentication';

export default class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = { username: '', password: '', passwordCheck: '', 
            userError: '', passError: '', passCheckErr: '' };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.formSubmit = this.formSubmit.bind(this);
    }
    
    handleInputChange(event) {
        this.setState({ [event.target.name]: event.target.value});
    }

    formSubmit = async (e) => {
        e.preventDefault();
        this.setState({userError: '', passError: '', passCheckErr: '' })
        const {username, password, passwordCheck} = this.state;
        const result = await signUp({username, password, passwordCheck});
        const returnData = await result.json();
        if(result.status == 201) {

        }
        else {
            const userError = 'username' in returnData ? returnData['username']  : '';
            const passError = 'password' in returnData ? returnData['password'] : '';
            const passCheckErr = 'passwordCheck' in returnData ? returnData['passwordCheck'] : '';
            this.setState({userError, passError, passCheckErr });
            console.log(returnData);
        }
    }

    render() {
        return (
            <div className="row">
                <div className="col-md-8 offset-md-2 col-lg-6 offset-lg-3">
                    <div className="card-stats card">
                        <div className="card-body">
                            <form onSubmit={this.formSubmit}>
                                <h3>Sign Up</h3>

                                <div className="form-group">
                                    <label>User name</label>
                                    <input 
                                        name="username"
                                        value={this.state.username}
                                        onChange={this.handleInputChange}
                                        type="text" 
                                        className="form-control" 

                                    />
                                </div>
                                <p className="text-danger font-weight-bold text-uppercase"
                                    >{this.state.userError}
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

                                <div className="form-group">
                                    <label>Confirm Password</label>
                                    <input 
                                        name="passwordCheck"
                                        value={this.state.passwordCheck}
                                        onChange={this.handleInputChange}
                                        type="password" 
                                        className="form-control"
                                    />
                                </div>
                                <p className="text-danger font-weight-bold text-uppercase">
                                    {this.state.passCheckErr}
                                </p>

                                <button type="submit" className="btn btn-primary btn-block">Sign Up</button>
                                <p className="forgot-password text-right">
                                    Already registered? <Link to="/sign-in">Sign in.</Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}