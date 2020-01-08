// import modules
import React, { Component, Fragment } from 'react';
import { Row } from 'react-bootstrap';
import scrollIntoView from 'scroll-into-view';
import axios from 'axios';
import $ from 'jquery';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// import components
import Logout from './auth/Logout';

class Navbar extends Component {
  constructor(props) {
    super(props);
    // state
    this.state = {
      categories: []
    };
  }

  // propTypes
  static propTypes = {
    auth: PropTypes.object.isRequired,
    navbarDropdown: PropTypes.bool
  };

  componentDidMount() {
    var form_container = $('.addsite-container');
    if (form_container.length > 0) $('.section-select').hide();
    else $('.section-select').show();
    axios
      .get('/api/categories')
      .then(response => {
        this.setState({ categories: response.data });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  scrollToSection = e => {
    const section = document.getElementById(e.target.value);
    scrollIntoView(section, {
      time: 500, // half a second
      align: {
        top: 0,
        topOffset: 64
      }
    });
  };

  render() {
    const { isAuthenticated, user } = this.props.auth;
    const navbarDropdown = this.props.navbarDropdown;

    const adminLinks = (
      <Fragment>
        <div
          style={{
            float: 'right',
            display: 'inline',
            fontSize: 15
          }}
        >
          <Logout />
        </div>
        <div
          style={{
            float: 'right',
            display: 'inline',
            fontSize: 15,
            minWidth: '70px'
          }}
        >
          <Link
            style={{
              textDecoration: 'none'
            }}
            to="/sites"
          >
            Sites
          </Link>
        </div>
        <div
          style={{
            float: 'right',
            display: 'inline',
            fontSize: 15,
            minWidth: '70px'
          }}
        >
          <Link
            style={{
              textDecoration: 'none'
            }}
            to="/clients"
          >
            Clients
          </Link>
        </div>
      </Fragment>
    );

    const userLinks = (
      <Fragment>
        <div
          style={{
            float: 'right',
            display: 'inline',
            fontSize: 15
          }}
        >
          <Logout />
        </div>
      </Fragment>
    );

    return (
      <div className="navbar-fixed">
        <nav className="z-depth-0">
          <div className="nav-wrapper center">
            <Row>
              <div className="col-lg-4 logo">
                <img src="assets/is_logo_blue.svg" alt="Interactive Services Logo" width="150" />
              </div>
              <div className="col-md-6 col-lg-4 site-title">
                <div className="blue-text header-title">
                  Solutions{/*  <span className="white-text">2019</span> */}
                </div>
              </div>
              <div className="col-sm-12 col-md-6 col-lg-4">
                {isAuthenticated && navbarDropdown ? (
                  <select
                    onChange={this.scrollToSection}
                    className="select-board-size section-select"
                    style={{
                      display: 'block',
                      float: 'left',
                      maxWidth: 250
                    }}
                  >
                    {this.state.categories.map((category, index) => (
                      <option key={index} value={category.title}>
                        {category.title}
                      </option>
                    ))}
                  </select>
                ) : (
                  ''
                )}
                {isAuthenticated && user.userType === 'admin'
                  ? adminLinks
                  : isAuthenticated && user.userType === 'client'
                  ? userLinks
                  : ''}
              </div>
            </Row>
          </div>
        </nav>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  navbarDropdown: state.navbar.navbarDropdown
});

export default connect(mapStateToProps, null)(Navbar);
