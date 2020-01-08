import axios from 'axios';
import { returnErrors } from './errorActions';
import {
  GET_SITE,
  GET_SITES,
  SITE_ADDED,
  SITE_DELETED,
  SITE_UPDATED,
  CLEAR_SITE_CREATED,
  CLEAR_SITE_UPDATED,
  CLEAR_SITE_DELETED,
  SITES_LOADING,
  CLOSE_MODAL,
  CLEAR_CLOSE_MODAL,
  SHOW_NAVBAR_DROPDOWN
} from './types';
import { tokenConfig } from './authActions';

export const getSites = () => dispatch => {
  dispatch(setSitesLoading());
  axios.get('/api/sites').then(res =>
    dispatch({
      type: GET_SITES,
      payload: res.data
    })
  );
};

export const getSiteData = siteId => dispatch => {
  dispatch(setSitesLoading());
  axios.get(`/api/sites/editsite/${siteId}`).then(res =>
    dispatch({
      type: GET_SITE,
      payload: res.data
    })
  );
};

export const addSite = formData => (dispatch, getState) => {
  // going to need to add a header in here with the token to check if user is authenticated to do this
  axios
    .post('/api/sites/addsite', formData, tokenConfig(getState))
    .then(res =>
      dispatch({
        type: SITE_ADDED
      })
    )
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status, 'UPLOAD_FAIL'));
    });
};

export const editSite = (id, formData) => (dispatch, getState) => {
  axios
    .put(`/api/sites/editsite/${id}`, formData, tokenConfig(getState))
    .then(res =>
      dispatch({
        type: SITE_UPDATED
      })
    )
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status, 'UPLOAD_FAIL'));
    });
};

export const deleteSite = id => (dispatch, getState) => {
  axios
    .delete(`/api/sites/deletesite/${id}`, tokenConfig(getState))
    .then(res =>
      dispatch({
        type: SITE_DELETED
      })
    )
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status, 'DELETE_FAIL'));
    });
};

export const clearSiteCreated = () => {
  return {
    type: CLEAR_SITE_CREATED
  };
};

export const clearSiteUpdated = () => {
  return {
    type: CLEAR_SITE_UPDATED
  };
};

export const clearSiteDeleted = () => {
  return {
    type: CLEAR_SITE_DELETED
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

export const setSitesLoading = () => {
  return {
    type: SITES_LOADING
  };
};

export const showNavbarDropdown = () => {
  return {
    type: SHOW_NAVBAR_DROPDOWN
  };
};
