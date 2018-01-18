/**
 * Created by ildevelop on 14.10.2017.
 */

import { GET_BOOKS_REQUEST } from '../constants/index';
import { ajax } from 'rxjs/observable/dom/ajax';
import { getBooksError, getBooksSuccess } from '../actions/index';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/catch';

export const books$ = action$ =>
  action$.ofType(GET_BOOKS_REQUEST)
         .switchMap(() => ajax.getJSON('/books').map((books) => getBooksSuccess(books)));
         // .switchMap(() => ajax.getJSON('/books').delay(100).map((books) => getBooksSuccess(books)));
