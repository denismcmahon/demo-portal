// module imports
import React, { Component, Fragment } from 'react';
import { NavLink } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// action imports
import { logout } from '../../actions/authActions';

export class Logout extends Component {
  // propTypes
  static propTypes = {
    logout: PropTypes.func.isRequired
  };

  render() {
    return (
      <Fragment>
        <NavLink
          onClick={this.props.logout}
          style={{
            display: 'inline'
          }}
          href="#"
        >
          Logout
        </NavLink>
      </Fragment>
    );
  }
}

export default connect(
  null,
  { logout }
)(Logout);
