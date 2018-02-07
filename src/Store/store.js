import {createStore } from 'redux';
import { SET_CLIENTS,SET_PARTNERS } from './constant'

const initState = {
  id: 0,
  names : ['Titanic', 'Fast Furious','X-men'],
  selectedFilm: null,
  clients: [],
  partners: [],
  client: {},

};


const reducerF = ( state = initState , action) => {
  switch (action.type) {
    case SET_CLIENTS:
      state = {...state, clients: action.payload};
      console.log('clients:',this.state.clients);
      break;
    case SET_PARTNERS:
      state = {...state, partners: action.payload};
      console.log('partners:',this.state.partners);

      break;


  }
  return state;

};

const store = createStore(reducerF);
export default store