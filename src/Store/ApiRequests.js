import axios from 'axios';

export default class Api {
  static deleteProcess(pr) {
    return axios.post('/delete_process', {process: pr})
  }
  static doneProcess(pr) {
    return axios.post('/done_process', {done_pr: pr})
  }
}