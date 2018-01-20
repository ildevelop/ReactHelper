import React, {Component} from 'react';
import AppBar from 'material-ui/AppBar';
import Loading from '../components/Loading';
import MainMenu from '../components/Dashboard/Dashboard';
import {
  BrowserRouter,
  Switch,
  Route,
  Link
} from 'react-router-dom';

const Home = () => (
  <div>
    <h1>Welcome to the Tornadoes Website!</h1>
  </div>
);
const Schedule = () => (
  <div>
    <ul>
      <li>6/5 @ Evergreens</li>
      <li>6/8 vs Kickers</li>
      <li>6/14 @ United</li>
    </ul>
  </div>
);
const MainMenuR = () => (
    <Switch>
      <Route exact path="/" component={<h2>clients</h2>}/>
      <Route exact path="/clients" component={<h2>clients</h2>}/>
      <Route path="/partners" component={<h2>partners</h2>}/>
    </Switch>
);
const Main = () => (
  <main>
    <Switch>
      <Route exact path="/" component={Home}/>

      <Route path="/schedule" component={Schedule}/>
    </Switch>
  </main>
);
const Header = () => (
  <header>
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/schedule">Schedule</Link></li>
      </ul>
    </nav>
  </header>
);

class App extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <div>


        <AppBar
          showMenuIconButton={false}
          title="React Helper"
          // howMenuIconButton={false}
          className="StyleMenu"
          iconElementRight={<h3>Login</h3>}
          iconStyleRight={{
            display: 'flex',
            marginTop: 0,
            marginRight: 0,
            alignItems: 'center',
            color: '#FFFFFF'
          }}
        />
        {this.props.loading
        && <Loading/>
        // || <MainGrid books={books} onSave={saveBook} onDelete={deleteBook} />
        || <MainMenu/>
        }
        <Header/>
        <Main/>

      </div>
    );
  }
}

export default App;
