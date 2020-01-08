// module imports
import React, { Component, Fragment } from 'react';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  Alert
} from 'reactstrap';
import { connect } from 'react-redux';
import uuidv1 from 'uuid';
import PropTypes from 'prop-types';

// action imports
import { addSite } from '../actions/siteActions';
import { getCategories } from '../actions/categoryActions';
import { clearErrors } from '../actions/errorActions';
import { closeModal } from '../actions/siteActions';
import { clearCloseModal } from '../actions/siteActions';

class AddSiteModal extends Component {
  // state
  state = {
    modal: false,
    dropdownOpen: false,
    title: '',
    category: 'Select Category',
    thumbnail: '',
    contentType: 'content',
    content: '',
    url: '',
    msg: null
  };

  // propTypes
  static propTypes = {
    addSite: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
    clearCloseModal: PropTypes.func.isRequired,
    error: PropTypes.object.isRequired,
    getCategories: PropTypes.func.isRequired,
    modalOpen: PropTypes.bool.isRequired,
    siteCreated: PropTypes.bool
  };

  componentDidMount() {
    // get the categories to populate the dropdown
    this.props.getCategories();
  }

  componentDidUpdate(prevProps) {
    const { error, siteCreated } = this.props;
    // if the modal isn't open the open it
    if (!this.state.modal) {
      if (this.props.modalOpen) {
        this.props.clearCloseModal();
        this.toggle();
      }
    }

    // if the modal is open and site has been created close the modal
    if (this.state.modal) {
      if (siteCreated) {
        this.props.closeModal();
        this.toggle();
      }
    }

    // if there was an error on the backend updating the data then add to the msg to display error
    if (error !== prevProps.error) {
      // Check for login error
      if (error.id === 'UPLOAD_FAIL') {
        this.setState({ msg: error.msg.msg });
      }
    }
  }

  // resets the state when toggled
  resetState = () => {
    this.setState({ title: '' });
    this.setState({ category: 'Select Category' });
    this.setState({ thumbnail: '' });
    this.setState({ content: '' });
    this.setState({ contentType: 'content' });
    this.setState({ url: '' });
    this.setState({ msg: null });
  };

  // toggle for the dropdown
  dropdownToggle = () => {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  };

  // toggle for the overall modal
  toggle = () => {
    this.resetState();
    // Clear errors
    this.props.clearErrors();
    this.setState({
      modal: !this.state.modal
    });
  };

  // on change event for the form entries
  onChange = e => {
    if (e.target.name === 'contentType') {
      if (e.target.value === 'content') this.setState({ url: this.state.url });
      else if (e.target.value === 'url') this.setState({ content: '' });
    }
    switch (e.target.name) {
      case 'thumbnail':
        this.setState({ thumbnail: e.target.files[0] });
        break;
      case 'content':
        this.setState({ content: e.target.files[0] });
        break;
      default:
        this.setState({ [e.target.name]: e.target.value });
    }
  };

  // called when a change in the dropdown
  changeDropDownValue = e => {
    this.setState({ category: e.currentTarget.textContent });
  };

  // function called when form submitted
  onSubmit = e => {
    e.preventDefault();

    this.props.clearErrors();
    this.setState({ msg: '' });

    if (!this.state.title) {
      this.setState({ msg: 'Please enter a title' });
      return;
    } else if (!this.state.category || this.state.category === 'Select Category') {
      this.setState({ msg: 'Please select a category' });
      return;
    } else if (!this.state.thumbnail) {
      this.setState({ msg: 'Please select a thumbnail' });
      return;
    } else if (this.state.contentType === 'content' && !this.state.content) {
      this.setState({ msg: 'Please select content to upload' });
      return;
    } else if (this.state.contentType === 'url' && !this.state.url) {
      this.setState({ msg: 'Please enter a url for the demo content' });
      return;
    }

    const { title, category, thumbnail, content, url, contentType } = this.state;
    const folder_uuid = uuidv1.v1();

    let formData = new FormData();

    formData.append('title', title);
    formData.append('category', category);
    formData.append('folderUuid', folder_uuid);
    formData.append('uploadType', 'new');
    if (contentType === 'url' && url !== '') formData.append('url', url);
    formData.append('thumbnail', thumbnail);
    if (contentType === 'content' && content !== '') formData.append('content', content);
    this.props.addSite(formData);
  };

  render() {
    const contentDiv = (
      <Fragment>
        <Label
          for="content"
          className="form-label"
          style={{
            marginTop: 12
          }}
        >
          Demo Content
        </Label>
        <Input
          type="file"
          name="content"
          id="content"
          placeholder="Demo Content"
          className="mb-3"
          onChange={this.onChange}
        />
      </Fragment>
    );

    const urlDiv = (
      <Fragment>
        <Label
          for="content"
          className="form-label"
          style={{
            marginTop: 12
          }}
        >
          Demo URL
        </Label>
        <Input
          type="text"
          name="url"
          id="url"
          placeholder="Enter URL"
          defaultValue={this.state.url}
          className="mb-3"
          onChange={this.onChange}
        />
      </Fragment>
    );

    const { contentType } = this.state;

    return (
      <div>
        <Modal className="add-site-modal" isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Add Site</ModalHeader>
          <ModalBody>
            {this.state.msg ? <Alert color="danger">{this.state.msg}</Alert> : null}
            <Form onSubmit={this.onSubmit}>
              <FormGroup>
                <Label for="title" className="form-label">
                  Demo Title
                </Label>
                <Input
                  type="text"
                  name="title"
                  id="title"
                  placeholder="Enter Demo Title"
                  className="mb-3"
                  onChange={this.onChange}
                />

                <Label for="category" className="form-label">
                  Demo Category
                </Label>

                <Dropdown isOpen={this.state.dropdownOpen} toggle={this.dropdownToggle}>
                  <DropdownToggle caret>{this.state.category}</DropdownToggle>
                  <DropdownMenu onChange={this.onChange}>
                    {this.props.category.categories.map((category, index) => (
                      <DropdownItem
                        key={index}
                        value={category.title}
                        onClick={this.changeDropDownValue}
                      >
                        {category.title}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>

                <br />

                <Label for="thumbnail" className="form-label">
                  Demo Thumbnail
                </Label>
                <Input
                  type="file"
                  name="thumbnail"
                  id="thumbnail"
                  placeholder="Demo Thumbnail"
                  className="mb-3"
                  onChange={this.onChange}
                />

                <Label for="content" className="form-label">
                  Content Type
                </Label>

                <div>
                  <Label
                    check
                    style={{
                      color: '#545252',
                      fontSize: 14
                    }}
                  >
                    <Input
                      type="radio"
                      name="contentType"
                      value="content"
                      style={{
                        position: 'relative',
                        top: 2,
                        opacity: 1
                      }}
                      onChange={this.onChange}
                      defaultChecked
                    />{' '}
                    Content
                  </Label>

                  <br />

                  <Label
                    check
                    style={{
                      color: '#545252',
                      fontSize: 14
                    }}
                  >
                    <Input
                      type="radio"
                      name="contentType"
                      value="url"
                      style={{
                        position: 'relative',
                        top: 2,
                        opacity: 1
                      }}
                      onChange={this.onChange}
                    />{' '}
                    URL
                  </Label>
                </div>

                {contentType === 'content' ? contentDiv : urlDiv}

                <Button color="dark" style={{ marginTop: '2rem' }} block>
                  Upload
                </Button>
              </FormGroup>
            </Form>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  category: state.category,
  siteCreated: state.site.siteCreated,
  error: state.error
});

export default connect(mapStateToProps, {
  addSite,
  getCategories,
  clearErrors,
  closeModal,
  clearCloseModal
})(AddSiteModal);
