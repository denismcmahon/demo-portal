// import modules
import React, { Component } from 'react';
import { Col, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// import actions
import { getSites, editSite, clearSiteCreated, clearSiteUpdated, clearSiteDeleted, clearCloseModal, showNavbarDropdown } from '../actions/siteActions';
import { getCategories } from '../actions/categoryActions';

// import components
import AddSiteModal from './AddSiteModal';
import EditSiteModal from './EditSiteModal';
import DeleteSiteModal from './DeleteSiteModal';

class Sites extends Component {
  // state
  state = {
    addSiteModal: false,
    editSiteModal: false,
    deleteSiteModal: false,
    siteId: '',
    sitesLoaded: false,
    categoriesLoaded: false,
    processedCatArrays: false,
    readyToProcess: false,
    categories: [],
    sites: [],
    categorySites: []
  };

  // propTypes
  static propTypes = {
    auth: PropTypes.object.isRequired,
    category: PropTypes.object.isRequired,
    categoryLoading: PropTypes.bool.isRequired,
    clearCloseModal: PropTypes.func.isRequired,
    clearSiteCreated: PropTypes.func.isRequired,
    clearSiteDeleted: PropTypes.func.isRequired,
    clearSiteUpdated: PropTypes.func.isRequired,
    editSite: PropTypes.func.isRequired,
    getCategories: PropTypes.func.isRequired,
    getSites: PropTypes.func.isRequired,
    modalClosed: PropTypes.bool.isRequired,
    site: PropTypes.object.isRequired,
    siteCreated: PropTypes.bool.isRequired,
    siteDeleted: PropTypes.bool.isRequired,
    siteLoading: PropTypes.bool.isRequired,
    siteUpdated: PropTypes.bool.isRequired,
    showNavbarDropdown: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.getCategories();
    this.props.getSites();
    this.props.showNavbarDropdown();
  }

  componentDidUpdate(prevProps) {
    // reset the addSiteModal flag if true
    if (this.state.addSiteModal) {
      this.setState({ addSiteModal: false });
    }

    // reset the editSiteModal flag if true
    if (this.state.editSiteModal) {
      this.setState({ editSiteModal: false });
    }

    // reset the deleteSiteModal flag if true
    if (this.state.deleteSiteModal) {
      this.setState({ deleteSiteModal: false });
    }

    // set the sites loaded flag to true
    if (prevProps.siteLoading && !this.props.siteLoading) {
      this.setState({ sitesLoaded: true });
    }

    // set the categories loaded flag to true
    if (prevProps.categoryLoading && !this.props.categoryLoading) {
      this.setState({ categoriesLoaded: true });
    }

    // when everything has loaded set the state arrays for sites and categories
    if (this.state.sitesLoaded && this.state.categoriesLoaded) {
      this.setState({ sites: this.props.site.sites });
      this.setState({ categories: this.props.category.categories });
      this.setState({ sitesLoaded: false });
      this.setState({ categoriesLoaded: false });
      this.setState({ readyToProcess: true });
    }

    if (this.state.sites.length > 0 && this.state.categories.length > 0 && this.state.readyToProcess) {
      // reset the category site array and then build up
      this.setState(
        {
          categorySites: []
        },
        () => {
          const { sites, categories, categorySites } = this.state;
          // create arrays for all categories of the sites within that category, create array with object containing the array title, and array of sites
          for (let a = 0; a < categories.length; a++) {
            let site_array = this.returnCategorySitesArray(categories[a].category, sites);
            const cat_obj = {
              title: categories[a].title,
              site_array: site_array
            };
            categorySites.push(cat_obj);
          }
          this.setState({ readyToProcess: false });
        }
      );
    }

    // if a new site has been created clear the flag and go get the sites again
    if ((this.props.siteCreated || this.props.siteUpdated || this.props.siteDeleted) && this.props.modalClosed) {
      this.setState({ processedCatArrays: false });
      this.props.clearSiteCreated();
      this.props.clearSiteUpdated();
      this.props.clearSiteDeleted();
      this.props.clearCloseModal();
      this.props.getSites();
      this.props.getCategories();
    }
  }

  // function to sort array based on property
  sortBy = (arr, prop) => {
    return arr.sort((a, b) => a[prop] - b[prop]);
  };

  // function that returns an array of sites in a category
  returnCategorySitesArray = (category, sites) => {
    let cat_site_array = [];
    for (let a = 0; a < sites.length; a++) {
      if (category === sites[a].category) {
        cat_site_array.push(sites[a]);
      }
    }
    cat_site_array = this.sortBy(cat_site_array, 'order');
    return cat_site_array;
  };

  // function to open the add site modal
  openAddSiteModal = () => {
    this.setState({ addSiteModal: true });
  };

  // function to open the edit modal
  openEditSiteModal = siteId => {
    this.setState({ editSiteModal: true });
    this.setState({ siteId: siteId });
  };

  // function to open the delete modal
  openDeleteSiteModal = siteId => {
    this.setState({ deleteSiteModal: true });
    this.setState({ siteId: siteId });
  };

  render() {
    const { isAuthenticated, user } = this.props.auth;
    return (
      <div
        className="sites-container"
        style={{
          paddingBottom: '65px'
        }}
      >
        <AddSiteModal modalOpen={this.state.addSiteModal} />
        <DeleteSiteModal modalOpen={this.state.deleteSiteModal} siteId={this.state.siteId} />
        <EditSiteModal modalOpen={this.state.editSiteModal} siteId={this.state.siteId} />
        <Row>
          <Col lg={isAuthenticated && user.userType === 'admin' ? '10' : '12'}>
            {this.state.categorySites.map((category, index) => (
              <div className="parent-container" key={index}>
                <div id={category.title} key={index} ref={category.title} className="container">
                  <h2 className="blue-text">{category.title}</h2>
                  <br />
                  <Row>
                    {category.site_array.map((site, index) => (
                      <Col
                        key={index}
                        className="site-tile"
                        xs={{ span: 12, offset: 2 }}
                        sm={{ span: 6, offset: 0 }}
                        md={{ span: 5, offset: 1 }}
                        lg={{ span: 4, offset: 0 }}
                        xl={{ span: 3, offset: 0 }}
                      >
                        <a href={site.link} target="_blank" rel="noopener noreferrer" className="site-anchor">
                          <img src={site.image} width="280" height="135" alt="Site Thumbnail" className="tile-img" />
                        </a>
                        <br />
                        <br />
                        <div className="site-title site-anchor">
                          <div
                            style={{
                              maxWidth: '280px'
                            }}
                          >
                            {isAuthenticated && user.userType === 'admin' ? (
                              <div
                                className="sample-title"
                                style={{
                                  maxWidth: '190px'
                                }}
                              >
                                {site.title}
                              </div>
                            ) : (
                              <div
                                className="sample-title"
                                style={{
                                  maxWidth: '255px'
                                }}
                              >
                                {site.title}
                              </div>
                            )}
                            <img
                              style={{
                                float: 'right'
                              }}
                              alt="Launch Circle"
                              src="assets/arrow_circle.svg"
                              width="20"
                              height="20"
                            />
                            {isAuthenticated && user.userType === 'admin' ? (
                              <div
                                style={{
                                  float: 'right'
                                }}
                              >
                                <img
                                  style={{
                                    float: 'right',
                                    marginRight: 10,
                                    cursor: 'pointer'
                                  }}
                                  src="assets/trash_icon.png"
                                  alt="Trash Icon"
                                  width="20"
                                  height="20"
                                  onClick={() => this.openDeleteSiteModal(site._id)}
                                />
                                <img
                                  style={{
                                    float: 'right',
                                    marginRight: 10,
                                    cursor: 'pointer'
                                  }}
                                  src="assets/edit_icon.png"
                                  alt="Edit Icon"
                                  width="20"
                                  height="20"
                                  onClick={() => this.openEditSiteModal(site._id)}
                                />
                              </div>
                            ) : (
                              ''
                            )}
                          </div>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>
              </div>
            ))}
          </Col>
          <Col lg="2">
            {isAuthenticated && user.userType === 'admin' ? (
              <div
                style={{
                  position: 'fixed',
                  top: '150px',
                  right: '100px',
                  cursor: 'pointer'
                }}
                onClick={() => this.openAddSiteModal()}
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
                  Add Site
                </span>
              </div>
            ) : (
              ''
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

Sites.propTypes = {
  getSites: PropTypes.func.isRequired,
  editSite: PropTypes.func.isRequired,
  clearSiteCreated: PropTypes.func.isRequired,
  site: PropTypes.object.isRequired,
  getCategories: PropTypes.func.isRequired,
  category: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  site: state.site,
  category: state.category,
  auth: state.auth,
  siteCreated: state.site.siteCreated,
  siteUpdated: state.site.siteUpdated,
  siteDeleted: state.site.siteDeleted,
  siteLoading: state.site.loading,
  modalClosed: state.modal.modalClosed,
  categoryLoading: state.category.loading
});

export default connect(mapStateToProps, {
  getSites,
  editSite,
  getCategories,
  clearSiteCreated,
  clearSiteUpdated,
  clearSiteDeleted,
  clearCloseModal,
  showNavbarDropdown
})(Sites);
