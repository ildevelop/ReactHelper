import './assets/styles.scss';
import React from 'react';
import { render } from 'react-dom';
import App from './containers/App';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { MuiThemeProvider } from 'material-ui';
import ErrorBoundary from './components/ErrorBoundary';
import { composeWithDevTools } from 'redux-devtools-extension';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();


render(
  <ErrorBoundary>
    <MuiThemeProvider>
        <App />
    </MuiThemeProvider>
  </ErrorBoundary>,
  document.getElementById('root')
);
