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


