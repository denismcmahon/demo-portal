import React, { Component } from 'react';
import axios from 'axios';
import { Form, Button, Dropdown, DropdownButton } from 'react-bootstrap';

class AddSite extends Component {
  constructor() {
    super();
    this.state = {
      sampletitle: '',
      samplecategory: 'Select Category',
      samplethumbnail: '',
      samplefile: '',
      // going to get from store
      categories: [],
      // going to get from store
      errors: {}
    };
  }

  componentDidMount() {
    axios
      .get('/categories')
      .then(response => {
        this.setState({ categories: response.data });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  onChange = e => {
    e.preventDefault();
    // event to update state when form inputs change
    switch (e.target.name) {
      case 'samplethumbnail':
        this.setState({ samplethumbnail: e.target.files[0] });
        break;
      case 'samplefile':
        this.setState({ samplefile: e.target.files[0] });
        break;
      default:
        this.setState({ [e.target.name]: e.target.value });
    }
  };

  handleDropdownSelect = e => {
    this.setState({ samplecategory: e });
  };

  handleValidation() {
    let errors = {};
    let formIsValid = true;

    if (!this.state.sampletitle) {
      formIsValid = false;
      errors['sampletitle'] = 'Please enter a title for the demo sample';
    }

    if (this.state.samplecategory === 'Select Category') {
      formIsValid = false;
      errors['samplecategory'] = 'Please select a category for the demo sample';
    }

    if (!this.state.samplethumbnail) {
      formIsValid = false;
      errors['samplethumbnail'] = 'Please select a thumbnail for the demo sample';
    }

    if (!this.state.samplefile) {
      formIsValid = false;
      errors['samplefile'] = 'Please select the content for the demo sample';
    }

    this.setState({ errors: errors });
    return formIsValid;
  }

  onSubmit = e => {
    e.preventDefault();
    if (this.handleValidation()) {
      console.log('Form submitted');
    } else {
      return;
    }
    // event to submit data to the server
    const { sampletitle, samplecategory, samplethumbnail, samplefile } = this.state;
    let formData = new FormData();

    formData.append('sampletitle', sampletitle);
    formData.append('samplecategory', samplecategory);
    formData.append('samplethumbnail', samplethumbnail);
    formData.append('samplefile', samplefile);

    axios
      .post('sites/addsite', formData)
      .then(result => {
        window.location.href = '/';
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  render() {
    return (
      <div className="jumbotron vertical-center">
        <div
          className="container addsite-container"
          style={{
            minHeight: '800px'
          }}
        >
          <Form onSubmit={this.onSubmit}>
            <Form.Group controlId="formBasicTitle">
              <Form.Label className="form-title blue-text">Sample Title</Form.Label>
              <Form.Control
                type="text"
                name="sampletitle"
                placeholder="Enter the sample title"
                style={{
                  borderBottom: 'none'
                }}
                onChange={this.onChange}
              />
              <span style={{ color: 'red' }}>{this.state.errors['sampletitle']}</span>
            </Form.Group>

            <hr />

            <Form.Group controlId="formBasicCategory">
              <Form.Label className="form-title blue-text">Sample Category</Form.Label>
              <br />
              <br />
              <DropdownButton name="category" title={this.state.samplecategory} id="document-type" onSelect={this.handleDropdownSelect}>
                {this.state.categories.map((category, index) => (
                  <Dropdown.Item key={index} value={category.title} eventKey={category.title}>
                    {category.title}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
              <br />
              <span style={{ color: 'red' }}>{this.state.errors['samplecategory']}</span>
            </Form.Group>

            <hr />

            <Form.Group controlId="formBasicThumbnail">
              <Form.Label className="form-title blue-text">Sample Thumbnail</Form.Label>
              <br />
              <br />
              <Form.Control name="samplethumbnail" type="file" onChange={this.onChange} />
              <br />
              <span style={{ color: 'red' }}>{this.state.errors['samplethumbnail']}</span>
            </Form.Group>

            <hr />

            <Form.Group controlId="formBasicFile">
              <Form.Label className="form-title blue-text">Sample File/s</Form.Label>
              <br />
              <br />
              <Form.Control name="samplefile" type="file" onChange={this.onChange} />
              <br />
              <span style={{ color: 'red' }}>{this.state.errors['samplefile']}</span>
            </Form.Group>

            <hr />

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </div>
      </div>
    );
  }
}

export default AddSite;
