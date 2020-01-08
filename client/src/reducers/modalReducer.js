import { CLOSE_MODAL, CLEAR_CLOSE_MODAL } from '../actions/types';

const initialState = {
  modalClosed: false
};

export default function(state = initialState, action) {
  switch (action.type) {
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
