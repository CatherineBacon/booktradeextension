import { Accounts, STATES } from 'meteor/std:accounts-ui';

export default class CustomLogin extends Accounts.ui.LoginForm {
  fields() {
    const { formState } = this.state;
    if (formState === STATES.SIGN_UP) {
      return {
        ...super.fields(),
        fullname: {
          id: 'fullname',
          hint: 'Enter your name',
          label: 'Your name',
          required: true,
          onChange: this.handleChange.bind(this, 'fullname'),
        },
        address: {
          id: 'address',
          hint: 'Give your address so people can sen you books',
          label: 'Your address',
          required: true,
          onChange: this.handleChange.bind(this, 'address'),
        },
      };
    }
    return super.fields();
  }

  signUp(options = {}) {
    const { fullname, address } = this.state;

    if (fullname.length === 0) {
      this.state.onSubmitHook(
        'error.accounts.fullnameRequired',
        this.state.formState,
      );
    } else if (address.length === 0) {
      this.state.onSubmitHook(
        'error.accounts.addressRequired',
        this.state.formState,
      );
    } else {
      options['fullname'] = fullname;
      options['address'] = address;
      super.signUp(options);
    }
  }
}
