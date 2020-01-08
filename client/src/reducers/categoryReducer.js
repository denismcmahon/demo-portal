import { GET_CATEGORIES, CATEGORIES_LOADING } from '../actions/types';

const initialState = {
  categories: [],
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_CATEGORIES:
      return {
        ...state,
        categories: action.payload,
        loading: false
      };
    case CATEGORIES_LOADING:
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
}
