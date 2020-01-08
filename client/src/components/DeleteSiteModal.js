// import modules
import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// import actions
import { deleteSite } from '../actions/siteActions';
import { clearErrors } from '../actions/errorActions';
import { closeModal } from '../actions/siteActions';

class DeleteSiteModal extends Component {
  // state
  state = {
    modal: false
  };

  // propTypes
  static propTypes = {
    closeModal: PropTypes.func.isRequired,
    deleteSite: PropTypes.func.isRequired,
    modalOpen: PropTypes.bool.isRequired,
    siteId: PropTypes.string.isRequired
  };

  componentDidMount() {}

  componentDidUpdate(prevProps) {
    // if the modal isn't open the open it and get the site data
    if (!this.state.modal) {
      if (this.props.modalOpen) {
        this.props.closeModal();
        this.toggle();
      }
    }
  }

  // toggle for the overall modal
  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  };

  // call action to delete the site on the backend
  deleteSite = () => {
    const { siteId } = this.props;
    this.props.deleteSite(siteId);
    this.toggle();
  };

  render() {
    return (
      <div>
        <Modal className="add-site-modal" isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Delete Site</ModalHeader>
          <ModalBody>
            <div className="text-center">Are you sure you wish to delete this site?</div>

            <div className="btn-wrapper">
              <Button color="danger" style={{ marginTop: '2rem' }} block onClick={this.deleteSite}>
                Yes
              </Button>

              <Button color="success" style={{ marginTop: '2rem' }} block onClick={this.toggle}>
                No
              </Button>
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  { deleteSite, clearErrors, closeModal }
)(DeleteSiteModal);
