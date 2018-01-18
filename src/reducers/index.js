/**
 * Created by ildevelop on 14.10.2017.
 */

import { handleActions } from 'redux-actions';
import * as actions from '../constants';

const initialState = {
  books: null,
  loading: false
};

export const books = handleActions({
  [actions.GET_BOOKS_REQUEST]: (state, action) => ({ ...state, loading: true }),
  [actions.GET_BOOKS_RESULT]: {
    next: (state, action) => ({ ...state, books: action.payload, loading: false }),
    throw: (state, action) => ({ ...state, books: null, loading: false })
  },
  [actions.SAVE_BOOK]: (state, { payload }) => ({
    ...state,
    books: state.books.slice(0, payload.index).concat(payload.book).concat(state.books.slice(payload.index + 1))
  }),
  [actions.DELETE_BOOK]: (state, { payload }) => ({
    ...state, books: state.books.slice(0, payload).concat(state.books.slice(payload + 1))
  })
}, initialState);
