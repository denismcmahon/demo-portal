import axios from 'axios';
import { GET_CATEGORIES, CATEGORIES_LOADING } from './types';

export const getCategories = () => dispatch => {
  dispatch(setCategoriesLoading());
  axios.get('/api/categories').then(res =>
    dispatch({
      type: GET_CATEGORIES,
      payload: res.data
    })
  );
};

export const setCategoriesLoading = () => {
  return {
    type: CATEGORIES_LOADING
  };
};
