import {createStore , applyMiddleware ,combineReducers } from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension'
import { SET_CLIENTS,SET_PARTNERS } from './constant'
import thunk from 'redux-thunk'

const initState = {
  id: 0,
  names : ['Titanic', 'Fast Furious','X-men'],
  selectedFilm: null,
  client: {},
  partners: [],
  clients: [],

};


const reducerClients = (state = initState ,action ) => {
  switch (action.type) {
    case SET_CLIENTS:
      state = {...state, clients:action.payload};
      break;
  }
  return state;
};
const reducerPartners = (state = initState ,action ) => {
  switch (action.type) {
    case SET_PARTNERS:
      state = {...state, partners:action.payload};
      // console.log('add partners to reducer', state);
      break;
  }
  return state;
};

const store = createStore(combineReducers({reducerPartners , reducerClients}), composeWithDevTools(applyMiddleware(thunk)));
export default store