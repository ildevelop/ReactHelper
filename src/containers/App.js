import React, {Component} from 'react';
import AppBar from 'material-ui/AppBar';
import Loading from '../components/Loading';
import MainMenu from '../components/Dashboard/Dashboard';
import FlatButton from 'material-ui/FlatButton';
import Login from './../components/Login/Login'
import {
  BrowserRouter,
  Switch,
  Route,
  Link
} from 'react-router-dom';


const Main = () => (
    <Switch>
      <Route exact path="/" component={MainMenu}/>
      <Route path="/login" component={() => (<Login/>)}/>
    </Switch>
);
const Header = () => (
  <div className="header-menu">
    <Link to="/">  <FlatButton label="HOME" primary={true} /></Link>
    <Link to="/login">  <FlatButton label="LOG IN" primary={true} /></Link>
  </div>

);

class App extends Component {
  constructor() {
    super();
    this.state = {
      loading:false
    };
  }

  render() {
    return (
      <div>
        <AppBar
          showMenuIconButton={false}
          title="React Helper"
          className="StyleMenu"
          iconElementRight={<Header/>}
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

export default App;
