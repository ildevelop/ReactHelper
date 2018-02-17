import {createStore , applyMiddleware ,combineReducers } from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension'
import {
  DELETE_PROCESS,
  HANDLE_DIALOG, SET_CLIENTS, SET_DONE_PROCESS, SET_NEW_PROCESS, SET_ONE_CLIENTS, SET_ONE_PARTNER, SET_PARTNERS,
  SET_PROBLEM, SET_PROCESS,
} from './constant'
import thunk from 'redux-thunk'

const initState = {
  id: 0,
  client: {},
  clients: [],
  partners: [],
  partner: {},
  openIntervention: false,
  problem:'',
  process: [],
  done_process: [],

};
const reducerMain = (state  = initState, action) => {
  switch (action.type) {
    case HANDLE_DIALOG:
      state = {...state, openIntervention: action.payload};
      break;
    case SET_PROCESS:
      state = {...state, process: action.payload};
      break;
    case SET_NEW_PROCESS:
      let newProcess = state.process;
      newProcess.push(action.payload);
      state = {...state, process: newProcess};
      break;
    case DELETE_PROCESS:
      let arr2 =state.process;
      let arr =arr2.filter(e => e !== action.payload);
      state = {...state, process: arr};
      break;
    case SET_DONE_PROCESS:
      state = {...state, done_process: action.payload};
      break;

  }
  return state;
};

const reducerClients = (state = initState ,action ) => {
  switch (action.type) {
    case SET_CLIENTS:
      state = {...state, clients:action.payload};
      break;
    case SET_ONE_CLIENTS:
      state = {...state, client:action.payload};
      break;
    case SET_PROBLEM:
      state = {...state, problem:action.payload};
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
    case SET_ONE_PARTNER:
      state = {...state, partner:action.payload};
      break;
  }
  return state;
};

const store = createStore(combineReducers({reducerPartners , reducerClients,reducerMain}), composeWithDevTools(applyMiddleware(thunk)));
export default store