import React from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.css";

import history from './history';
import routes from './routes';
import './assets/css/paper-dashboard.min.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import { validAuthTokenExists } from './utils/AuthTokenStore';

const routeComponents = routes.map(route => {
  return <Route path={route.path} exact component={route.component} key={route.title}/>
});

class App extends React.Component {
  mainPanel = React.createRef();

  render() {
    if(!validAuthTokenExists()) {
      setTimeout(() => {
        history.push('/sign-in');
      }, 10);
    }


    
    return (
      <Router history={history} >
        
        <div className="wrapper">
          <Sidebar
            {...this.props}
            routes={routes}
          />
          <div className="main-panel" ref={this.mainPanel}>
            <Header {...this.props}/>
            <div className="content">
              <Switch>
                {routeComponents}
                <Redirect to="/dashboard" />
              </Switch>
            </div>
          </div>
        </div>
      </Router>
    )
  }
}

export default App;
