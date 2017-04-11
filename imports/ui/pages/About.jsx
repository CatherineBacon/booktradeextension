import React, { Component, PropTypes } from 'react';
import { Row, Col, PageHeader } from 'react-bootstrap';

export default class Home extends Component {
  render() {
    return (
      <Row>
        <Col>
          <PageHeader>About</PageHeader>
        </Col>
        <Col>
          <p>
            This app was originally created as part of the following FreeCodeCamp challenge:
            {' '}
            <a
              href="https://www.freecodecamp.com/challenges/manage-a-book-trading-club"
            >
              https://www.freecodecamp.com/challenges/manage-a-book-trading-club
            </a>
          </p>
          <p>
            <strong>
              Final app:
              {' '}
              <a href="https://catherinebookexchange.herokuapp.com/">
                https://catherinebookexchange.herokuapp.com/
              </a>
            </strong>
          </p>
          <p>
            My parents showed an unprecedented level of enthusiasm for a book swapping app, so based on their expanded criteria, I've fleshed out the user stories and tried to make the whole site more slick.
          </p>
        </Col>
        <Col>
          <h3>Objective</h3>
          <p><em>FreeCodeCamp</em></p>
          <p>
            Build a full stack JavaScript app that is functionally similar to
            {' '}
            <a href="http://bookjump.herokuapp.com/">this</a>
            .
          </p>
          <h5>User Stories:</h5>
          <ul>
            <li>I can view all books posted by every user.</li>
            <li>I can add a new book.</li>
            <li>
              I can update my settings to store my full name, city, and state.
            </li>
            <li>
              I can propose a trade and wait for the other user to accept the trade.
            </li>
          </ul>
          <br />
          <p><em>The parents</em></p>
          <p>(some have not yet been fulfilled!)</p>
          <ul>
            <li>Make the books a bit prettier and give more information</li>
            <li>Email users upon a succesful trade</li>
            <li>Send users addresses when a trade is agreed</li>
            <li>Add review/comments from last user</li>
            <li>
              Search - in general, also by book category, also by location
            </li>
          </ul>
        </Col>
        <Col>
          <h3>Libraries/Frameworks</h3>
          <p>
            I used
            {' '}
            <a href="https://www.meteor.com/">Meteor</a>
            {' '}
            as the platform. Combined with
            {' '}
            <a href="https://guide.meteor.com/react.html">React</a>
            . I also used
            {' '}
            <a
              href="https://github.com/ReactTraining/react-router/tree/master/packages/react-router"
            >
              React Router
            </a>
            {' '}
            for the routing.
          </p>
          <p>
            List of book options and book cover image obtained from the
            {' '}
            <a href="https://github.com/smilledge/node-google-books-search">
              node google-books-search api
            </a>
            .
          </p>
          <p>
            It is styled with
            {' '}
            <a href="https://react-bootstrap.github.io/">react-bootstrap</a>
            {' '}
            and the Flatly theme from
            {' '}
            <a href="https://bootswatch.com/">boostswatch</a>
            .
          </p>
          <p>
            I also used
            {' '}
            <a href="https://github.com/furqanZafar/react-selectize">
              react-selectize
            </a>
            {' '}
            for the dropdown.
          </p>
        </Col>
      </Row>
    );
  }
}
