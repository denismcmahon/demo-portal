// import modules
import React, { Component } from 'react';

class Footer extends Component {
  render() {
    return (
      <div
        className="navbar-fixed"
        style={{
          backgroundColor: '#273338',
          overflow: 'hidden',
          position: 'fixed',
          bottom: '0',
          width: '100%'
        }}
      >
        <center
          style={{
            color: 'white',
            paddingTop: '20px'
          }}
          className="footer-text"
        >
          Copyright ©2019 Interactive Services | All Rights Reserved | ISO9001 Certified Company{' '}
        </center>
      </div>
    );
  }
}

export default Footer;
