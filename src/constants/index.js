/**
 * Created by ildevelop on 14.10.2017.
 */

import PropTypes from 'prop-types';

export const GET_BOOKS_REQUEST = 'GET_BOOKS_REQUEST';
export const GET_BOOKS_RESULT = 'GET_BOOKS_RESULT';

export const SAVE_BOOK = 'SAVE_BOOK';
export const DELETE_BOOK = 'DELETE_BOOK';


export const bookPropType = PropTypes.shape({
  title: PropTypes.string,
  author: PropTypes.string,
  date: PropTypes.object
});
