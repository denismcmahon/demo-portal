// module imports
import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// action imports
import { login } from '../../actions/authActions';
import { clearErrors } from '../../actions/errorActions';

class LoginModal extends Component {
  // state
  state = {
    modal: false,
    email: '',
    password: '',
    msg: null
  };

  // propTypes
  static propTypes = {
    clearErrors: PropTypes.func.isRequired,
    error: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool,
    login: PropTypes.func.isRequired
  };

  componentDidUpdate(prevProps) {
    const { error, isAuthenticated } = this.props;
    if (error !== prevProps.error) {
      // Check for login error
      if (error.id === 'LOGIN_FAIL') {
        this.setState({ msg: error.msg.msg });
      } else {
        this.setState({ msg: null });
      }
    }

    // If authenticated redirect to the sites page
    if (isAuthenticated) {
      this.props.history.push('/sites');
    }
  }

  toggle = () => {
    // Clear errors
    this.props.clearErrors();
    this.setState({
      modal: !this.state.modal
    });
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const { email, password } = this.state;

    const user = {
      email,
      password
    };

    // Attempt to login
    this.props.login(user);
  };

  render() {
    return (
      <div>
        <div
          className="container"
          style={{
            width: '600px',
            marginTop: '150px',
            border: '1px solid grey',
            padding: '50px'
          }}
        >
          {this.state.msg ? <Alert color="danger">{this.state.msg}</Alert> : null}
          <Form onSubmit={this.onSubmit}>
            <FormGroup>
              <Label for="email" className="form-label">
                Login
              </Label>
              <Input type="text" name="email" id="email" placeholder="Enter Login Id" className="mb-3" onChange={this.onChange} />

              <Label for="password" className="form-label">
                Password
              </Label>
              <Input type="password" name="password" id="password" placeholder="Enter Password" className="mb-3" onChange={this.onChange} />
              <Button color="dark" style={{ marginTop: '2rem' }} block>
                Login
              </Button>
            </FormGroup>
          </Form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error
});

export default connect(
  mapStateToProps,
  { login, clearErrors }
)(LoginModal);
