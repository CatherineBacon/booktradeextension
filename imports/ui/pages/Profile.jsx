import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import {
  Row,
  PageHeader,
  Col,
  Form,
  FormGroup,
  FormControl,
  Button,
} from 'react-bootstrap';

import UserInfo from '../../api/users';
import CustomLogin from '../components/CustomLogin.jsx';

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fullName: '',
      city: '',
      country: '',
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const { value, name } = event.target;

    this.setState({
      [name]: value,
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    const { fullName, city, country } = this.state;

    Meteor.call('Meteor.users.additionalinfo.update', fullName, city, country);

    this.setState({
      fullName: '',
      city: '',
      country: '',
    });
  }

  render() {
    if (!this.props.currentUser) {
      return (
        <Row>
          <PageHeader>Please login</PageHeader>
          <CustomLogin />
        </Row>
      );
    }

    const { fullName, city, country } = this.props.currentUser;

    return (
      <Row>
        <Col>
          <PageHeader>Profile</PageHeader>
        </Col>
        <Col xs={6}>
          <h4>Details</h4>
          <p><b>Username</b>: {Meteor.user().username}</p>
          <p><b>Email address</b>: {Meteor.user().emails[0].address}</p>
          {fullName && <p><b>Full name</b>: {fullName}</p>}
          {city && <p><b>Town/City</b>: {city}</p>}
          {country && <p><b>Country</b>: {country}</p>}

        </Col>
        <Col xs={6}>
          <h4>Update Profile</h4>
          <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
            <FormGroup>
              <Col xs={2}>Full name:</Col>
              {' '}
              <Col xs={10}>
                <FormControl
                  type="text"
                  name="fullName"
                  onChange={this.handleInputChange}
                  value={this.state.fullName}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col xs={2}>City/Town:</Col>
              {' '}
              <Col xs={10}>
                <FormControl
                  type="text"
                  name="city"
                  onChange={this.handleInputChange}
                  value={this.state.city}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col xs={2}>Country:</Col>
              {' '}
              <Col xs={10}>
                <FormControl
                  type="text"
                  name="country"
                  onChange={this.handleInputChange}
                  value={this.state.country}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col xsOffset={2} xs={10}>
                <Button type="submit">Update</Button>
              </Col>
            </FormGroup>
          </Form>
        </Col>
      </Row>
    );
  }
}

Profile.propTypes = {
  currentUser: PropTypes.object,
};

export default createContainer(
  () => {
    Meteor.subscribe('Meteor.users.additionalinfo');

    return {
      currentUser: Meteor.user(),
    };
  },
  Profile,
);
