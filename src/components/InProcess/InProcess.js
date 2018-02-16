import React, {Component} from 'react';
import {Paper} from "material-ui";
import {connect} from 'react-redux'
const style = {
  height: 300,
  width: 300,
  margin: 20,
  textAlign: 'center',
  display: 'inline-block',
};


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
      <div>
        <Paper style={style} zDepth={2} rounded={false} />
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