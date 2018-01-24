import React, {Component} from 'react';
import './Login.scss'
import AuthService from './../../AuthService'
class Login extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.Auth = new AuthService();
  }
  handleChange(e){
    this.setState({ [e.target.name]:e.target.value})
  }
  handleFormSubmit(e){

    this.Auth.login(this.state.username,this.state.password)
      .then(res => {
        this.props.history.replace('/');
      })
      .catch(err => {
        alert(err);
      })
  }
  componentWillMount(){
    if(this.Auth.loggedIn())
      this.props.history.replace('/')
  }
  render() {
    return (
      <div className="login">
        <h1>Login</h1>
        <form method="post" onSubmit={this.handleFormSubmit}>
          <input type="text" name="u" placeholder="Username" required="required" onChange={this.handleChange}/>
          <input type="password" name="p" placeholder="Password" required="required" />
          <button type="submit" className="btn btn-primary btn-block btn-large">Let me in.</button>
        </form>
      </div>
    )
  }
}

export default Login