import { combineReducers } from 'redux';
import siteReducer from './siteReducer';
import clientReducer from './clientReducer';
import categoryReducer from './categoryReducer';
import authReducer from './authReducer';
import modalReducer from './modalReducer';
import errorReducer from './errorReducer';
import navbarReducer from './navbarReducer';

export default combineReducers({
  site: siteReducer,
  client: clientReducer,
  category: categoryReducer,
  auth: authReducer,
  modal: modalReducer,
  navbar: navbarReducer,
  error: errorReducer
});
