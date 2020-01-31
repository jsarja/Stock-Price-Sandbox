import React from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import "bootstrap/dist/css/bootstrap.css";

import routes from './routes';
import './assets/css/paper-dashboard.min.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

const history = createBrowserHistory();

const routeComponents = routes.map(route => {
  return <Route path={route.path} exact component={route.component} key={route.title}/>
});

class App extends React.Component {
  mainPanel = React.createRef();

  render() {
    return (
      <Router history={history} >
        <div className="wrapper">
          <Sidebar
            {...this.props}
            routes={routes}
          />
          <div className="main-panel" ref={this.mainPanel}>
            <Header {...this.props}/>
            <Switch>
              {routeComponents}
              <Redirect to="/dashboard" />
            </Switch>
          </div>
        </div>
      </Router>
    )
  }
}

export default App;
