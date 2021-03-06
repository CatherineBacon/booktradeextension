import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Grid, Row, Col, Panel } from 'react-bootstrap';

import MyBooks from './pages/MyBooks.jsx';
import AllBooks from './pages/AllBooks.jsx';
import Profile from './pages/Profile.jsx';
import MySuccessfulTrades from './pages/MySuccessfulTrades.jsx';
import Menu from './components/Menu.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';

class App extends Component {
  render() {
    return (
      <Router>
        <Grid>

          <Route
            render={({ history }) => (
              <Menu history={history} currentUser={this.props.currentUser} />
            )}
          />

          <Route exact path="/" render={() => <Home />} />

          <Route path="/mysuccessfultrades" component={MySuccessfulTrades} />

          <Route path="/profile" component={Profile} />

          <Route path="/mybooks" component={MyBooks} />

          <Route path="/allbooks" component={AllBooks} />

          <Route path="/about" component={About} />

          <Row className="footer">
            <Col>
              <Panel>
                Written and coded by
                {' '}
                <a href="https://github.com/CatherineBacon/booktradeextension">
                  Catherine Bacon
                </a>
                <Link to="/about" className="pull-right">About</Link>
              </Panel>
            </Col>
          </Row>

        </Grid>
      </Router>
    );
  }
}

App.propTypes = {
  currentUser: PropTypes.object,
};

export default createContainer(
  () => {
    return {
      currentUser: Meteor.user(),
    };
  },
  App,
);
