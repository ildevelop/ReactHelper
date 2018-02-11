import React, {Component} from 'react';
import AppBar from 'material-ui/AppBar';
import Loading from '../components/Loading';
import Dashboard from '../components/Dashboard/Dashboard';
import FlatButton from 'material-ui/FlatButton';
import Login from './../components/Login/Login'
import axios from 'axios';
import {connect} from 'react-redux'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom';

export const getAuthentication = {
  isAuthenticated: false,
  authenticate(cb) {
    let token = localStorage.getItem('token');
    let self = this;
    axios.post('/authenticate', {
      token: token
    })
      .then(function (response) {
        let body = response.data['status']
        if (body === 'approved') {
          self.isAuthenticated = true;
          setTimeout(cb, 1);
        }
        else {
          localStorage.removeItem('token');
          self.isAuthenticated = false;
        }
      })
      .catch(function (error) {
        console.log(error);
        self.isAuthenticated = false;
      });
  },
  signout(cb) {
    this.isAuthenticated = false
    localStorage.removeItem('token');
    setTimeout(cb, 1);
  }
}

const PrivateRoute = ({component: Component, ...rest}) => (
  <Route {...rest} render={props => (
    getAuthentication.isAuthenticated ? (
      <Component {...props}/>
    ) : (
      <Redirect to={{
        pathname: '/login',
        state: {from: '/dashboard'}
      }}/>
    )
  )}/>
)

const Main = () => (
  <Switch>
    <PrivateRoute path="/dashboard" component={Dashboard}/>
    <Route path="/login" component={() => <Login/>}/>
  </Switch>
);

class App extends Component {
  constructor() {
    super();
    this.state = {
      loading: false
    };

  }



  logout() {
    this.setState({loading: true});
    getAuthentication.signout(() => {
      this.setState({loading: false})
    });
  }

  render() {
    return (
      <div>
        <AppBar
          showMenuIconButton={false}
          title="React Helper"
          className="StyleMenu"
          iconElementRight={<div className="header-menu">
            <Link to="/"> <FlatButton label="HOME" primary={true}/></Link>
            <Link to="/login"> <FlatButton label="LOG IN" primary={true}/></Link>
            <FlatButton onClick={this.logout.bind(this)} label="logout" primary={true}/>

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
{/*<button onClick={this.props.loadClients}></button>*/}
      </div>
    );
  }
}


// export default connect(
//   state => ({}),
//   dispatch => ({
//     onAddTrack: (name) => {
//       const payload = {
//         id: Date.now().toString(),
//         name
//       };
//       dispatch({ type: 'ADD_TRACK', payload });
//     },
//     onFindTrack: (name) => {
//       console.log('name', name);
//       dispatch({ type: 'FIND_TRACK', payload: name});
//     },
//     loadClients: () => {
//       const asyncGetClients = () => dispatch => {
//         console.log("Icgot clients");
//         dispatch({ type: 'FETCH_CLIENTS_SUCCESS', payload: []})
//       };
//       dispatch(asyncGetClients());
//     }
//   })
// )(App);
export default App
