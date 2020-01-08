import {
  GET_CLIENT,
  GET_CLIENTS,
  CLIENT_CREATED,
  CLIENT_UPDATED,
  CLIENT_DELETED,
  CLEAR_CLIENT_CREATED,
  CLEAR_CLIENT_UPDATED,
  CLEAR_CLIENT_DELETED,
  CLIENTS_LOADING,
  CLOSE_MODAL,
  CLEAR_CLOSE_MODAL
} from '../actions/types';

const initialState = {
  clients: [],
  client: {},
  clientCreated: false,
  clientUpdated: false,
  clientDeleted: false,
  modalClosed: false,
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_CLIENT:
      return {
        ...state,
        client: action.payload,
        loading: false
      };
    case GET_CLIENTS:
      return {
        ...state,
        clients: action.payload,
        loading: false
      };
    case CLIENT_CREATED:
      return {
        ...state,
        clientCreated: true
      };
    case CLIENT_UPDATED:
      return {
        ...state,
        clientUpdated: true
      };
    case CLIENT_DELETED:
      return {
        ...state,
        clientDeleted: true
      };
    case CLEAR_CLIENT_CREATED:
      return {
        ...state,
        clientCreated: false
      };
    case CLEAR_CLIENT_UPDATED:
      return {
        ...state,
        clientUpdated: false
      };
    case CLEAR_CLIENT_DELETED:
      return {
        ...state,
        clientDeleted: false
      };
    case CLIENTS_LOADING:
      return {
        ...state,
        loading: true
      };
    case CLOSE_MODAL: {
      return {
        ...state,
        modalClosed: true
      };
    }
    case CLEAR_CLOSE_MODAL: {
      return {
        ...state,
        modalClosed: false
      };
    }
    default:
      return state;
  }
}
