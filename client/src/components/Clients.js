// import modules
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'react-bootstrap';
import { Input } from 'reactstrap';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TablePagination from '@material-ui/core/TablePagination';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';

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
    clientsFiltered: [],
    addClientModal: false,
    editClientModal: false,
    clientId: '',
    deleteClientModal: false,
    clientsLoaded: false,
    search: '',
    sortAscending: false,
    sortOrder: 'desc',
    page: 0,
    rowsPerPage: 10
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
    this.setState({
      clientsFiltered: clientsArray
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

  filter = async () => {
    await this.setState({ clientsFiltered: this.state.clients });
    let currentSearch = this.state.search;
    this.setState({
      clientsFiltered: this.state.clientsFiltered.filter(e =>
        e.name.toUpperCase().includes(currentSearch.toUpperCase())
      )
    });
    this.setState({ page: 0 });
  };

  onChange = e => {
    switch (e.target.name) {
      default:
        this.setState({ [e.target.name]: e.target.value });
    }
    this.filter();
  };

  sortBy = (field, reverse, primer) => {
    const key = primer
      ? function(x) {
          return primer(x[field]);
        }
      : function(x) {
          return x[field];
        };

    reverse = !reverse ? 1 : -1;

    return function(a, b) {
      a = key(a);
      b = key(b);
      return reverse * ((a > b) - (b > a));
    };
  };

  sortData = columnName => {
    this.setState({
      clients: this.state.clientsFiltered.sort(
        this.sortBy(columnName, this.state.sortAscending, a => a.toUpperCase())
      )
    });
    this.setState({ sortAscending: !this.state.sortAscending });
    let newSortOrder = this.state.sortOrder === 'desc' ? 'asc' : 'desc';
    this.setState({ sortOrder: newSortOrder });
  };

  render() {
    const { isAuthenticated, user } = this.props.auth;

    const useStyles1 = makeStyles(theme => ({
      root: {
        flexShrink: 0,
        marginLeft: theme.spacing(2.5)
      }
    }));

    const TablePaginationActions = props => {
      const classes = useStyles1();
      const theme = useTheme();
      let { page, rowsPerPage } = this.state;
      let count = this.state.clientsFiltered.length;

      const handleFirstPageButtonClick = event => {
        handleChangePage(event, 0);
      };

      const handleBackButtonClick = event => {
        handleChangePage(event, page - 1);
      };

      const handleNextButtonClick = event => {
        handleChangePage(event, page + 1);
      };

      const handleLastPageButtonClick = event => {
        handleChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
      };

      return (
        <div className={classes.root}>
          <IconButton
            onClick={handleFirstPageButtonClick}
            disabled={page === 0}
            aria-label="first page"
          >
            {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
          </IconButton>
          <IconButton
            onClick={handleBackButtonClick}
            disabled={page === 0}
            aria-label="previous page"
          >
            {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
          </IconButton>
          <IconButton
            onClick={handleNextButtonClick}
            disabled={page >= Math.ceil(count / rowsPerPage) - 1}
            aria-label="next page"
          >
            {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
          </IconButton>
          <IconButton
            onClick={handleLastPageButtonClick}
            disabled={page >= Math.ceil(count / rowsPerPage) - 1}
            aria-label="last page"
          >
            {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
          </IconButton>
        </div>
      );
    };

    const handleChangePage = (event, newPage) => {
      this.setState({ page: newPage });
    };

    const handleChangeRowsPerPage = event => {
      this.setState({ rowsPerPage: parseInt(event.target.value, 10) });
      this.setState({ page: 0 });
    };
    return (
      <Container>
        <AddClientModal modalOpen={this.state.addClientModal} />
        <DeleteClientModal
          modalOpen={this.state.deleteClientModal}
          clientId={this.state.clientId}
        />
        <EditClientModal modalOpen={this.state.editClientModal} clientId={this.state.clientId} />
        <Input
          type="text"
          name="search"
          id="search"
          placeholder="Search client name"
          className="mb-3"
          onChange={this.onChange}
          style={{ maxWidth: '400px' }}
        />
        <Row>
          <Col xl="10 " lg="8" md="5">
            <div
              style={{
                marginBottom: '100px'
              }}
            >
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>
                      <TableSortLabel
                        direction={this.state.sortOrder}
                        onClick={() => this.sortData('name')}
                      >
                        Client Name
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        direction={this.state.sortOrder}
                        onClick={() => this.sortData('email')}
                      >
                        Client Email
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Expiry Date</TableCell>
                    <TableCell>Days Until Expiry</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(this.state.rowsPerPage > 0
                    ? this.state.clientsFiltered.slice(
                        this.state.page * this.state.rowsPerPage,
                        this.state.page * this.state.rowsPerPage + this.state.rowsPerPage
                      )
                    : this.state.clientsFiltered
                  ).map((client, index) => (
                    <TableRow key={index} style={client.daysTilExpiry <= 0 ? { color: 'red' } : {}}>
                      <TableCell component="th" scope="row">
                        {index + 1}
                      </TableCell>
                      <TableCell
                        align="left"
                        style={client.daysTilExpiry <= 0 ? { color: 'red' } : {}}
                      >
                        {client.name}
                      </TableCell>
                      <TableCell
                        align="left"
                        style={client.daysTilExpiry <= 0 ? { color: 'red' } : {}}
                      >
                        {client.email}
                      </TableCell>
                      <TableCell
                        align="left"
                        style={client.daysTilExpiry <= 0 ? { color: 'red' } : {}}
                      >
                        {client.expiryDate}
                      </TableCell>
                      <TableCell
                        align="left"
                        style={client.daysTilExpiry <= 0 ? { color: 'red' } : {}}
                      >
                        {client.daysTilExpiry}
                      </TableCell>
                      <TableCell align="left">
                        <u onClick={() => this.openEditClientModal(client._id)}>Edit</u>
                      </TableCell>
                      <TableCell align="left">
                        <u onClick={() => this.openDeleteClientModal(client._id)}>Delete</u>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25]}
                      count={this.state.clientsFiltered.length}
                      rowsPerPage={this.state.rowsPerPage}
                      page={this.state.page}
                      SelectProps={{
                        inputProps: { 'aria-label': 'rows per page' },
                        native: true
                      }}
                      onChangePage={handleChangePage}
                      onChangeRowsPerPage={handleChangeRowsPerPage}
                      ActionsComponent={TablePaginationActions}
                    />
                  </TableRow>
                </TableBody>
              </Table>
            </div>
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
