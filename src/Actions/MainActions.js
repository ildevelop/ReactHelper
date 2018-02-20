import * as actionTypes from './../Store/constant';
import Api from "../Store/ApiRequests";

export function deleteProcess(pr) {
  return function(dispatch) {
    return Api.deleteProcess(pr).then(() => dispatch({
        type: actionTypes.DELETE_PROCESS,
        pr
      })
    )

  }
}
export function doneProcess(pr) {
  return function(dispatch) {
    return Api.doneProcess(pr).then(() => dispatch({
        type: actionTypes.SET_ONE_DONE_PROCESS,
        pr
      })
    )
  }
}
export function deleteDone(pr) {
  return function(dispatch) {
    return Api.deleteDone(pr).then(() => dispatch({
        type: actionTypes.DELETE_DONE,
        pr
      })
    )
  }
}
export function setPartners() {
  return function(dispatch) {
    return Api.setPartners().then((res) => dispatch({
        type: actionTypes.SET_PARTNERS,
        payload: res.data
      })
    )
  }
}
export function setClients() {
  return function(dispatch) {
    return Api.setClients().then((res) => dispatch({
        type: actionTypes.SET_CLIENTS,
        payload: res.data
      })
    )
  }
}
export function setProcess() {
  return function(dispatch) {
    return Api.setProcess().then((res) => dispatch({
        type: actionTypes.SET_PROCESS,
        payload: res.data
      })
    )
  }
}
export function setDone() {
  return function(dispatch) {
    return Api.setDone().then((res) => dispatch({
        type: actionTypes.SET_DONE_PROCESS,
        payload: res.data
      })
    )
  }
}


