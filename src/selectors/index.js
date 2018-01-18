/**
 * Created by ildevelop on 14.10.2017.
 */

import { createSelector } from 'reselect';

const books = (state) => state.books || [];
const formatTitle = (title) => title && title.replace(/\W/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase().split(' ')
                                   .map((word) => word && (word[0].toUpperCase() + word.slice(1))).join(' ') || '';

export const getBooks = createSelector(books, (books) => books.map((book) => ({
  author: book.author,
  date: new Date(book.date),
  title: formatTitle(book.title)
})));
