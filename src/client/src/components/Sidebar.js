/*!

=========================================================
* Paper Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Licensed under MIT (https://github.com/creativetimofficial/paper-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import { NavLink } from "react-router-dom";
import { Nav } from "reactstrap";

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.activeRoute.bind(this);
    this.sidebar = React.createRef();
  }
  // verifies if routeName is the one active (in browser input)
  activeRoute(routeName) {
    return window.location.href.indexOf(routeName) > -1 ? "active" : "";
  }

  componentDidMount() {
    if(window.location.href.includes('sign-')) {
      this.mainPanelWidth = document.querySelector(".main-panel").style.width;
      document.querySelector(".main-panel").style.width = "100%";
    }
  }

  componentWillUnmount() {
    document.querySelector(".main-panel").style.width = "calc(100% - 260px)";
  }

  render() {
    // Dont show sidebar on sign-in and sign-up pages.
    if(window.location.href.includes('sign-')) {
      return null;
    }
    return (
      <div
        className="sidebar"
        data-color="black"
        data-active-color="info"
      >
        
        <div className="sidebar-wrapper" ref={this.sidebar}>
          <Nav className="">
            {this.props.routes.map((prop, key) => {
              if(prop.path.includes('sign-')) {
                return;
              }
              let header = null;
              if(prop.header) {
                header = <div className="ml-2 mt-3 mb-2 text-secondary">{prop.header}</div>
              }
              return ( <div key={key}>
                {header}
                <li
                  className={this.activeRoute(prop.path)}
                >
                  <NavLink
                    to={prop.path}
                    className="m-0 px-2 text-capitalize py-1 nav-link ml-3"
                    activeClassName="active"
                    style={{fontSize: "1rem"}}
                    onClick={() => this.forceUpdate()}
                  >
                    <p>{prop.title}</p>
                  </NavLink>
                </li>
              </div>);
            })}
          </Nav>
        </div>
      </div>
    );
  }
}



export default Sidebar;