// module imports
import React, { Component } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  Alert,
  Form,
  FormGroup,
  Label,
  Input,
  Button
} from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// action imports
import { addClient } from '../actions/clientActions';
import { clearErrors } from '../actions/errorActions';
import { closeModal } from '../actions/clientActions';
import { clearCloseModal } from '../actions/clientActions';
import { addClientMail } from '../actions/clientActions';

class AddClientModal extends Component {
  // state
  state = {
    modal: false,
    name: '',
    email: '',
    expiryDays: 0,
    userType: 'client',
    password: '',
    mailType: '',
    msg: null
  };

  // propTypes
  static propTypes = {
    clientCreated: PropTypes.bool,
    clearErrors: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
    clearCloseModal: PropTypes.func.isRequired,
    error: PropTypes.object.isRequired,
    modalOpen: PropTypes.bool.isRequired,
    addClient: PropTypes.func.isRequired,
    addClientMail: PropTypes.func.isRequired
  };

  componentDidMount() {}

  // toggle for the overall modal
  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  };

  componentDidUpdate(prevProps) {
    const { error, clientCreated } = this.props;

    // if the modal isn't open the open it
    if (!this.state.modal) {
      if (this.props.modalOpen) {
        this.props.clearCloseModal();
        this.toggle();
      }
    }

    // if the modal is open and client has been created close the modal
    if (this.state.modal) {
      if (clientCreated) {
        this.props.closeModal();
        this.toggle();
      }
    }

    // if there was an error on the backend updating the data then add to the msg to display error
    if (error !== prevProps.error) {
      // Check for login error
      if (error.id === 'REGISTER_FAIL' || error.id === 'MAILSEND_FAIL') {
        this.setState({ msg: error.msg.msg });
      }
    }
  }

  // on change event for the form entries
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = async e => {
    e.preventDefault();

    this.props.clearErrors();
    this.setState({ msg: '' });

    if (!this.state.name) {
      this.setState({ msg: 'Please enter a Client Name' });
      return;
    } else if (!this.state.email) {
      this.setState({ msg: 'Please enter a client Login Id' });
      return;
    } else if (/\s/.test(this.state.email)) {
      this.setState({ msg: 'Please make sure the client Login Id has no spaces' });
      return;
    } else if (!this.state.expiryDays) {
      this.setState({ msg: 'Please enter a number of expiry days' });
      return;
    } else if (!this.state.password) {
      this.setState({ msg: 'Please enter a password for the client' });
      return;
    }

    await this.setState({ mailType: 'addClient' });

    const { name, email, expiryDays, userType, password, mailType } = this.state;

    // Create user object
    const newUser = {
      name,
      email,
      expiryDays,
      userType,
      password,
      mailType
    };

    // Attempt to register
    await this.props.addClient(newUser);

    this.props.addClientMail(newUser);
  };

  render() {
    return (
      <div>
        <Modal className="add-site-modal" isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Add Client</ModalHeader>
          <ModalBody>
            {this.state.msg ? <Alert color="danger">{this.state.msg}</Alert> : null}
            <Form onSubmit={this.onSubmit}>
              <FormGroup>
                <Label for="title" className="form-label">
                  Client Name
                </Label>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Enter Client Name"
                  className="mb-3"
                  onChange={this.onChange}
                />

                <Label for="title" className="form-label">
                  Client Login Id
                </Label>
                <Input
                  type="text"
                  name="email"
                  id="email"
                  placeholder="Enter Client Login Id"
                  className="mb-3"
                  onChange={this.onChange}
                />

                <Label for="title" className="form-label">
                  Client Expiry (In Days)
                </Label>
                <Input
                  type="number"
                  name="expiryDays"
                  id="expiryDays"
                  placeholder="Enter Client Expiry (in days)"
                  className="mb-3"
                  onChange={this.onChange}
                />

                <Label for="password" className="form-label">
                  Password
                </Label>
                <Input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Enter Client Password"
                  className="mb-3"
                  onChange={this.onChange}
                />

                <Button color="dark" style={{ marginTop: '2rem' }} block>
                  Add Client
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
  clientCreated: state.client.clientCreated
});

export default connect(mapStateToProps, {
  addClient,
  clearErrors,
  closeModal,
  clearCloseModal,
  addClientMail
})(AddClientModal);
