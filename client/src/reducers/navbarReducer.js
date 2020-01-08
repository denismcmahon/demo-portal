import { HIDE_NAVBAR_DROPDOWN, SHOW_NAVBAR_DROPDOWN } from '../actions/types';

const initialState = {
  navbarDropdown: true
};

export default function(state = initialState, action) {
  switch (action.type) {
    case HIDE_NAVBAR_DROPDOWN: {
      return {
        navbarDropdown: false
      };
    }
    case SHOW_NAVBAR_DROPDOWN: {
      return {
        navbarDropdown: true
      };
    }
    default:
      return state;
  }
}
