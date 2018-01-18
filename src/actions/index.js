import { createAction } from 'redux-actions';
/**
 * Created by ildevelop on 14.10.2017.
 */
import * as actions from '../constants';

export const getBooksRequest = createAction(actions.GET_BOOKS_REQUEST);
export const getBooksSuccess = createAction(actions.GET_BOOKS_RESULT, (books) => books);

export const saveBook = createAction(actions.SAVE_BOOK, (index, book) => ({index, book}));
export const deleteBook = createAction(actions.DELETE_BOOK, (index) => index);
