// import modules
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'react-bootstrap';
import { Input } from 'reactstrap';
import { Table, Thead, Th, Tr, Td } from 'reactable';

// import actions
import {
  getClients,
  editClient,
  clearClientCreated,
  clearClientUpdated,
  clearClientDeleted,
  clearCloseModal,
  hideNavbarDropdown
} from '../actions/clientActions';

// import components
import AddClientModal from './AddClientModal';
import EditClientModal from './EditClientModal';
import DeleteClientModal from './DeleteClientModal';

// import helpers
const helpers = require('../helpers/helpers');

class Clients extends Component {
  // state
  state = {
    clients: [],
    addClientModal: false,
    editClientModal: false,
    clientId: '',
    deleteClientModal: false,
    clientsLoaded: false,
    search: ''
  };

  static propTypes = {
    // propTypes
    auth: PropTypes.object.isRequired,
    clearClientCreated: PropTypes.func.isRequired,
    clearClientDeleted: PropTypes.func.isRequired,
    clearCloseModal: PropTypes.func.isRequired,
    clearClientUpdated: PropTypes.func.isRequired,
    clientCreated: PropTypes.bool.isRequired,
    clientDeleted: PropTypes.bool.isRequired,
    clientLoading: PropTypes.bool.isRequired,
    clientUpdated: PropTypes.bool.isRequired,
    editClient: PropTypes.func.isRequired,
    getClients: PropTypes.func.isRequired,
    modalClosed: PropTypes.bool.isRequired,
    hideNavbarDropdown: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.getClients();
    this.props.hideNavbarDropdown();
  }

  componentDidUpdate(prevProps) {
    // reset the addClientModal flag if true
    if (this.state.addClientModal) {
      this.setState({ addClientModal: false });
    }

    // reset the editClientModal flag if true
    if (this.state.editClientModal) {
      this.setState({ editClientModal: false });
    }

    // reset the deleteClientModal flag if true
    if (this.state.deleteClientModal) {
      this.setState({ deleteClientModal: false });
    }

    // set the sites loaded flag to true
    if (prevProps.clientLoading && !this.props.clientLoading) {
      this.setState({ clientsLoaded: true });
    }

    // when everything has loaded set the state array for clients
    if (this.state.clientsLoaded) {
      this.setState({ clientsLoaded: false });
      this.arrangeClientData(this.props.client.clients);
    }

    // if a new site has been created clear the flag and go get the sites again
    if (
      (this.props.clientCreated || this.props.clientUpdated || this.props.clientDeleted) &&
      this.props.modalClosed
    ) {
      this.props.clearClientCreated();
      this.props.clearClientUpdated();
      this.props.clearClientDeleted();
      this.props.clearCloseModal();
      this.props.getClients();
    }
  }

  // on change event for the form entries
  onChange = e => {
    switch (e.target.name) {
      default:
        this.setState({ [e.target.name]: e.target.value });
    }
  };

  // function to run through client array and set the short form dates and set the days left to expire
  arrangeClientData = clients => {
    let clientsArray = [];
    for (var a = 0; a < clients.length; a++) {
      let clientObject = {};
      clientObject.name = clients[a].name;
      clientObject.email = clients[a].email;
      clientObject._id = clients[a]._id;
      const expiryDate = new Date(clients[a].expiryDate);
      const expiryDateShort = helpers.dateToDDMMYY(expiryDate);
      clientObject.expiryDate = expiryDateShort;
      const todaysDate = new Date();

      let diffDays = helpers.getDaysBetweenDates(todaysDate, expiryDate);
      if (diffDays < 0) diffDays = 0;
      clientObject.daysTilExpiry = diffDays;

      clientsArray.push(clientObject);
    }
    this.setState({
      clients: clientsArray
    });
  };

  // function to open the add client modal
  openAddClientModal = () => {
    this.setState({ addClientModal: true });
  };

  // function to open the edit modal
  openEditClientModal = clientId => {
    this.setState({ editClientModal: true });
    this.setState({ clientId: clientId });
  };

  // function to open the delete modal
  openDeleteClientModal = clientId => {
    this.setState({ deleteClientModal: true });
    this.setState({ clientId: clientId });
  };

  render() {
    const { isAuthenticated, user } = this.props.auth;
    return (
      <Container>
        <AddClientModal modalOpen={this.state.addClientModal} />
        <DeleteClientModal
          modalOpen={this.state.deleteClientModal}
          clientId={this.state.clientId}
        />
        <EditClientModal modalOpen={this.state.editClientModal} clientId={this.state.clientId} />
        <Row>
          <Input
            type="text"
            name="search"
            id="search"
            placeholder="Search client or client email"
            className="mb-3"
            onChange={this.onChange}
          />
        </Row>
        <Row>
          <Col xl="10 " lg="8" md="5">
            <Table
              className="table"
              id="table"
              itemsPerPage={10}
              pageButtonLimit={100}
              sortable={true}
              filterable={['clientName', 'clientEmail']}
              filterBy={this.state.search}
              hideFilterInput
            >
              <Thead>
                <Th column="index">
                  <strong>#</strong>
                </Th>
                <Th column="clientName">
                  <strong>Client Name</strong>
                </Th>
                <Th column="clientEmail">
                  <strong>Client Email</strong>
                </Th>
                <Th column="expiryDate">
                  <strong>Expiry Date</strong>
                </Th>
                <Th column="daysToExpiry">
                  <strong>Days Until Expiry</strong>
                </Th>
                <Th column="edit">
                  <strong></strong>
                </Th>
                <Th column="delete">
                  <strong></strong>
                </Th>
              </Thead>
              {console.log('==>')}
              {console.log(this.state.clients)}
              {this.state.clients.map((client, index) => (
                <Tr key={index} style={client.daysTilExpiry <= 0 ? { color: 'red' } : {}}>
                  <Th column="index" scope="row">
                    {index + 1}
                  </Th>
                  {console.log('client name')}
                  {console.log(client.name)}
                  <Td column="clientName">{client.name}</Td>
                  <Td column="clientEmail">{client.email}</Td>
                  <Td column="expiryDate">{client.expiryDate}</Td>
                  <Td column="daysToExpiry">{client.daysTilExpiry}</Td>
                  <Td column="edit">
                    <u onClick={() => this.openEditClientModal(client._id)}>Edit</u>
                  </Td>
                  <Td column="delete">
                    <u onClick={() => this.openDeleteClientModal(client._id)}>Delete</u>
                  </Td>
                </Tr>
              ))}
            </Table>
          </Col>
          <Col lg="2">
            {isAuthenticated && user.userType === 'admin' ? (
              <div
                style={{
                  width: '100px',
                  cursor: 'pointer',
                  marginLeft: '50px'
                }}
                onClick={() => this.openAddClientModal()}
              >
                <img src="assets/add_site_button.png" width="100" height="100" alt="" />
                <span
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    marginTop: '5px',
                    fontWeight: 'bold'
                  }}
                >
                  Add Client
                </span>
              </div>
            ) : (
              ''
            )}
          </Col>
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  client: state.client,
  auth: state.auth,
  clientCreated: state.client.clientCreated,
  clientUpdated: state.client.clientUpdated,
  clientDeleted: state.client.clientDeleted,
  clientLoading: state.client.loading,
  modalClosed: state.modal.modalClosed
});

export default connect(mapStateToProps, {
  getClients,
  editClient,
  clearClientCreated,
  clearClientUpdated,
  clearClientDeleted,
  clearCloseModal,
  hideNavbarDropdown
})(Clients);
