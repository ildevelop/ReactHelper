import React, {Component} from 'react';
import './Login.scss'
import ActionAndroid from 'material-ui/svg-icons/image/details';
import {RaisedButton} from 'material-ui';

const styles = {
  button: {
    margin: 12,
  }
};

class Login extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: ''
    };
  }
  render() {
    return (
      <div className="login">
        <h1>Login</h1>
        <form method="post">
          <input type="text" name="u" placeholder="Username" required="required"/>
          <input type="password" name="p" placeholder="Password" required="required"/>
          <RaisedButton
            href="http://localhost:3000/"
            type="submit"
            label="Let me in"
            labelPosition="before"
            primary={true}
            icon={<ActionAndroid/>}
            style={styles.button}
          />
        </form>
      </div>
    )
  }
}

export default Login