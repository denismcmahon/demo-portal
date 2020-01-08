// module imports
import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, Alert, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// action imports
import { editClient } from '../actions/clientActions';
import { getClientData } from '../actions/clientActions';
import { clearErrors } from '../actions/errorActions';
import { closeModal } from '../actions/clientActions';

// import helpers
const helpers = require('../helpers/helpers');

class EditClientModal extends Component {
  // state
  state = {
    modal: false,
    name: '',
    email: '',
    expiryDays: null,
    userType: 'client',
    password: '',
    msg: null
  };

  // propTypes
  static propTypes = {
    clientCreated: PropTypes.bool,
    clearErrors: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
    error: PropTypes.object.isRequired,
    modalOpen: PropTypes.bool.isRequired,
    client: PropTypes.object.isRequired,
    clientId: PropTypes.string.isRequired,
    clientLoading: PropTypes.bool.isRequired,
    clientUpdated: PropTypes.bool.isRequired,
    getClientData: PropTypes.func.isRequired,
    editClient: PropTypes.func.isRequired
  };

  componentDidMount() {}

  // toggle for the overall modal
  toggle = () => {
    this.resetState();
    // Clear errors
    this.props.clearErrors();
    this.setState({
      modal: !this.state.modal
    });
  };

  componentDidUpdate(prevProps) {
    if (this.state.modal) {
      const { error, clientUpdated } = this.props;

      // if the modal is open and the site has been edited, close the modal
      if (this.state.modal) {
        if (clientUpdated) {
          this.props.closeModal();
          this.toggle();
        }
      }

      // if there was an error on the backend updating the data then add to the msg to display error
      if (error !== prevProps.error) {
        // Check for login error
        if (error.id === 'UPLOAD_FAIL') {
          this.setState({ msg: error.msg.msg });
        }
      }

      // if the modal is open and the site has been fully retrieved from the backend, set the state to fill the relevant parts of the form
      if (prevProps.clientLoading && !this.props.clientLoading && this.state.modal) {
        this.setState({ name: this.props.client.name });
        this.setState({ email: this.props.client.email });
        const expiryDate = new Date(this.props.client.expiryDate);
        const todaysDate = new Date();
        let diffDays = helpers.getDaysBetweenDates(todaysDate, expiryDate);
        if (diffDays < 0) diffDays = 0;
        this.setState({ expiryDays: diffDays });
      }
    } else {
      // if the modal isn't open the open it and get the client data
      if (this.props.modalOpen) {
        this.toggle();
        if (this.props.clientId) {
          this.props.getClientData(this.props.clientId);
        }
      }
    }
  }

  // resets the state when toggled
  resetState = () => {
    this.setState({ name: '' });
    this.setState({ email: '' });
    this.setState({ expiryDays: null });
    this.setState({ userType: 'client' });
    this.setState({ password: '' });
  };

  // on change event for the form entries
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    this.props.clearErrors();
    this.setState({ msg: '' });

    const { name, email, expiryDays, userType, password } = this.state;
    const clientId = this.props.clientId;

    // Create user object
    const newUser = {
      name,
      email,
      expiryDays,
      userType,
      password,
      clientId
    };

    // Attempt to register
    this.props.editClient(newUser);
  };

  render() {
    return (
      <div>
        <Modal className="add-site-modal" isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Edit Client</ModalHeader>
          <ModalBody>
            {this.state.msg ? <Alert color="danger">{this.state.msg}</Alert> : null}
            <Form onSubmit={this.onSubmit}>
              <FormGroup>
                <Label for="title" className="form-label">
                  Client Name
                </Label>
                <Input type="text" name="name" id="name" defaultValue={this.state.name} placeholder="Enter Client Name" className="mb-3" onChange={this.onChange} />

                <Label for="title" className="form-label">
                  Client Login Id
                </Label>
                <Input type="text" name="email" id="email" defaultValue={this.state.email} placeholder="Enter Client Login Id" className="mb-3" onChange={this.onChange} />

                <Label for="title" className="form-label">
                  Client Expiry (In Days)
                </Label>
                <Input type="number" name="expiryDays" id="expiryDays" defaultValue={this.state.expiryDays} placeholder="Enter Client Expiry (in days)" className="mb-3" onChange={this.onChange} />

                <Label for="password" className="form-label">
                  Password
                </Label>
                <Input type="password" name="password" id="password" placeholder="Enter Client Password" className="mb-3" onChange={this.onChange} />

                <Button color="dark" style={{ marginTop: '2rem' }} block>
                  Update Client
                </Button>
              </FormGroup>
            </Form>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  error: state.error,
  client: state.client.client,
  clientUpdated: state.client.clientUpdated,
  clientCreated: state.client.clientCreated,
  clientLoading: state.client.loading
});

export default connect(
  mapStateToProps,
  { editClient, getClientData, clearErrors, closeModal }
)(EditClientModal);
