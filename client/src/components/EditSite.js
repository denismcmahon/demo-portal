import React, { Component } from 'react';

export default class EditSite extends Component {
  constructor(props) {
    super(props);
    console.log('id: ');
    console.log(this.props.match.params.id);
  }
  render() {
    return <h4>Edit site page</h4>;
  }
}
