import React, {Component} from 'react';
import AppBar from 'material-ui/AppBar';
import Loading from '../components/Loading';
import Dashboard from '../components/Dashboard/Dashboard';
import FlatButton from 'material-ui/FlatButton';
import Login from './../components/Login/Login'
import AuthService from './../AuthService'
import withAuth from './../withAuth'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';

const Auth = new AuthService();
const Main = () => (
    <Switch>
      <Route exact path="/" component={Dashboard}/>
      <Route path="/login" component={() => <Login/>}/>
      <Route exact path="/logout" component={() => <h2>logout</h2>}/>
    </Switch>
);

class App extends Component {
  constructor() {
    super();
    this.state = {
      loading:false
    };
    this.handleLogout = this.handleLogout.bind(this);
  }
  handleLogout(){
    Auth.logout();
    this.props.history.replace('/login')
  }
  render() {
    return (
      <div>
        <AppBar
          showMenuIconButton={false}
          title="React Helper"
          className="StyleMenu"
          iconElementRight={<div className="header-menu">
            <Link to="/">  <FlatButton label="HOME" primary={true} /></Link>
            <Link to="/login">  <FlatButton label="LOG IN" primary={true} /></Link>
            <Link to="/logout">  <FlatButton label="logout" primary={true}  /></Link>

          </div>}
          iconStyleRight={{
            display: 'flex',
            marginTop: 0,
            marginRight: 0,
            alignItems: 'center',
            color: '#FFFFFF'
          }}
        />
        {this.state.loading
        && <Loading/>
        // || <MainGrid books={books} onSave={saveBook} onDelete={deleteBook} />
        || <Main/>
        }

      </div>
    );
  }
}

export default withAuth(App);
