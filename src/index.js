import './assets/styles.scss';
import React from 'react';
import {render} from 'react-dom';
import App from './containers/App';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {MuiThemeProvider} from 'material-ui';
import ErrorBoundary from './components/ErrorBoundary';
import {BrowserRouter} from 'react-router-dom'
import { Provider} from 'react-redux';
import store from './Store/store'

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();
render(
  <Provider store={store}>
    <ErrorBoundary>
      <BrowserRouter>
        <MuiThemeProvider>
          <App/>
        </MuiThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </Provider>,
  document.getElementById('root')
);
