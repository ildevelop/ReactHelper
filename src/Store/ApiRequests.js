import axios from 'axios';

export default class Api {
  static deleteProcess(pr) {
    return axios.post('/delete_process', {process: pr})
  }
  static doneProcess(pr) {
    return axios.post('/done_process', {done_pr: pr})
  }
  static deleteDone(pr) {
    return axios.post('/delete_done_process', {done_process: pr})
  }
  static setPartners() {
    return axios.get('/get_partners')
  }
  static setClients() {
    return axios.get('/get_clients')
  }
  static setProcess() {
    return axios.get('/get_process')
  }
  static setDone() {
    return axios.get('/get_done_process')
  }
  static addClient(cl) {
    return axios.post('/add_client',{clients: cl})
  }
  static addPartner(parner) {
    return axios.post('/add_partners',{partners: parner})
  }
  static setCategories() {
    return axios.get('/get_categories')
  }
}