import React, { Component } from 'react';
import { Accounts } from 'meteor/std:accounts-ui';

export default class AccountsUIWrapper extends Component {
  render() {
    return <Accounts.ui.LoginForm />;
  }
}
