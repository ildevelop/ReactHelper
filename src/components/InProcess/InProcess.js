import React, {Component} from 'react';
import {Paper} from "material-ui";
import {connect} from 'react-redux'
import './InProcess.scss'

class InProcess extends Component {
  constructor(props) {
    super(props);
    this.state = {
      all_process : this.props.proc
    }

  }

  render() {
    let cl = this.state.all_process;
    console.log('all process:',cl);
    return (
      <div className="in_process">
        {Object.keys(this.state.all_process).length?
          <div>
            <Paper className ="paper_process" zDepth={2} rounded={false} />
          </div>:
          <div>
            <h1 className="not_process"> There is not one open process </h1>

          </div>}

      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    clients: state.reducerClients
  }
};

export default connect(mapStateToProps
  // , dispatch => ({
  // AddOneClients: (client) => {
  //   dispatch({type: SET_ONE_CLIENTS, payload: client})
  // }})
)(InProcess)