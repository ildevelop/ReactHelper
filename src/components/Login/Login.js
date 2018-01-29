/* eslint-disable jsx-quotes */
import React, {Component} from 'react';
import './Login.scss'
import {BrowserRouter, browserHistory} from 'react-router-dom'
import ActionAndroid from 'material-ui/svg-icons/image/details';
import {RaisedButton} from 'material-ui';
import {getAuthentication} from '../../containers/App.js';
import axios from 'axios';
import {
  Redirect
} from 'react-router-dom'

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
      password: '',
      loading: false,
      redirectToReferrer: false
    };
  }

  componentWillMount() {
    let self = this;
    let token = localStorage.getItem('token');
    if (token !== null && token !== undefined) {
      getAuthentication.authenticate(() => {
        self.setState({redirectToReferrer: true})
      });
    }
  }

  handleUsernameChange(e) {
    this.setState({username: e.target.value});
  }

  handlePasswordChange(e) {
    this.setState({password: e.target.value});
  }

  authticate() {
    let self = this;
    this.loading = true;
    axios.post('/get_token', {
      username: this.state.username,
      password: this.state.password
    })
      .then(function (response) {
        let body = response.data['token'];
        if (body !== undefined && body !== null) {
          localStorage.setItem('token', body);
          getAuthentication.authenticate(() => {
            self.setState({redirectToReferrer: true})
          });
        }
        else {
          localStorage.removeItem('token');
          console.log(response.data);
          self.setState({redirectToReferrer: false});
          //TODO display login faliure credentials
          //handle faliure login
        }
        self.loading = false;
      })
      .catch(function (error) {
        console.log(error);
      });

  }

  render() {
    const {redirectToReferrer} = this.state;

    if (redirectToReferrer) {
      return (
        <Redirect to='/dashboard'/>
      )
    }
    else {
      return (
        <div className='login'>
          <h1>Login</h1>
          <form onSubmit={this.authticate.bind(this)}>
            <input value={this.state.username} onChange={this.handleUsernameChange.bind(this)}
                   type='text' name='username' placeholder='Username' required='required'/>
            <input value={this.state.password} onChange={this.handlePasswordChange.bind(this)}
                   type='password' name='password' placeholder='Password' required='required'/>
            <RaisedButton
              label='Let me in'
              labelPosition='before'
              // onClick={this.authticate.bind(this)}
              primary={true}
              icon={<ActionAndroid/>}
              style={styles.button}
              type="submit"
            />
          </form>
        </div>
      )
    }
  }
}

export default Login;
