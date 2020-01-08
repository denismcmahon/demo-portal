import { GET_SITE, GET_SITES, SITE_ADDED, SITE_UPDATED, SITE_DELETED, CLEAR_SITE_CREATED, CLEAR_SITE_UPDATED, CLEAR_SITE_DELETED, SITES_LOADING } from '../actions/types';

const initialState = {
  sites: [],
  site: {},
  siteCreated: false,
  siteUpdated: false,
  siteDeleted: false,
  modalClosed: false,
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_SITE:
      return {
        ...state,
        site: action.payload,
        loading: false
      };
    case GET_SITES:
      return {
        ...state,
        sites: action.payload,
        loading: false
      };
    case CLEAR_SITE_CREATED:
      return {
        ...state,
        siteCreated: false
      };
    case CLEAR_SITE_UPDATED:
      return {
        ...state,
        siteUpdated: false
      };
    case CLEAR_SITE_DELETED:
      return {
        ...state,
        siteDeleted: false
      };
    case SITE_ADDED:
      return {
        ...state,
        siteCreated: true
      };
    case SITE_UPDATED:
      return {
        ...state,
        siteUpdated: true
      };
    case SITE_DELETED:
      return {
        ...state,
        siteDeleted: true
      };
    case SITES_LOADING:
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
}
