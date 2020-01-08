import axios from 'axios';
import { returnErrors } from './errorActions';
import { tokenConfig } from './authActions';

import {
  GET_CLIENT,
  GET_CLIENTS,
  CLIENT_DELETED,
  CLIENT_UPDATED,
  CLIENT_CREATED,
  CLEAR_CLIENT_CREATED,
  CLEAR_CLIENT_UPDATED,
  CLEAR_CLIENT_DELETED,
  CLIENTS_LOADING,
  CLOSE_MODAL,
  CLEAR_CLOSE_MODAL,
  HIDE_NAVBAR_DROPDOWN
} from './types';

export const getClients = () => dispatch => {
  dispatch(setClientsLoading());
  axios.get('/api/clients').then(res =>
    dispatch({
      type: GET_CLIENTS,
      payload: res.data
    })
  );
};

export const getClientData = clientId => dispatch => {
  dispatch(setClientsLoading());
  axios.get(`/api/clients/editclient/${clientId}`).then(res =>
    dispatch({
      type: GET_CLIENT,
      payload: res.data
    })
  );
};

// Add Client
export const addClient = ({ name, email, expiryDays, userType, password }) => (
  dispatch,
  getState
) => {
  // Headers
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  // Request body
  const body = JSON.stringify({ name, email, expiryDays, userType, password });

  axios
    .post('/api/users/addclient', body, tokenConfig(getState), config)
    .then(res =>
      dispatch({
        type: CLIENT_CREATED
      })
    )
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status, 'REGISTER_FAIL'));
    });
};

export const editClient = ({ name, email, expiryDays, userType, password, clientId }) => (
  dispatch,
  getState
) => {
  // Headers
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  // Request body
  const body = JSON.stringify({ name, email, expiryDays, userType, password });

  axios
    .put(`/api/users/editclient/${clientId}`, body, tokenConfig(getState), config)
    .then(res =>
      dispatch({
        type: CLIENT_UPDATED
      })
    )
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status, 'REGISTER_FAIL'));
    });
};

export const deleteClient = clientId => (dispatch, getState) => {
  axios
    .delete(`/api/users/deleteclient/${clientId}`, tokenConfig(getState))
    .then(res =>
      dispatch({
        type: CLIENT_DELETED
      })
    )
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status, 'DELETE_FAIL'));
    });
};

// Add Client
export const addClientMail = ({ name, email, expiryDays, userType, password, mailType }) => (
  dispatch,
  getState
) => {
  // Headers
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  // Request body
  const body = JSON.stringify({ name, email, expiryDays, userType, password, mailType });

  console.log('body =>');
  console.log(body);

  axios.post('/api/mails/emailnotification', body, tokenConfig(getState), config).catch(err => {
    dispatch(returnErrors(err.response.data, err.response.status, 'MAILSEND_FAIL'));
  });
};

export const clearClientCreated = () => {
  return {
    type: CLEAR_CLIENT_CREATED
  };
};

export const clearClientUpdated = () => {
  return {
    type: CLEAR_CLIENT_UPDATED
  };
};

export const clearClientDeleted = () => {
  return {
    type: CLEAR_CLIENT_DELETED
  };
};

export const closeModal = () => {
  return {
    type: CLOSE_MODAL
  };
};

export const clearCloseModal = () => {
  return {
    type: CLEAR_CLOSE_MODAL
  };
};

export const setClientsLoading = () => {
  return {
    type: CLIENTS_LOADING
  };
};

export const hideNavbarDropdown = () => {
  return {
    type: HIDE_NAVBAR_DROPDOWN
  };
};
