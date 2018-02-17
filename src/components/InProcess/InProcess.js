import React, {Component} from 'react';
import {Paper, RaisedButton} from "material-ui";
import {connect} from 'react-redux'
import Done from 'material-ui/svg-icons/action/done';
import Delete from 'material-ui/svg-icons/action/delete';
import './InProcess.scss'
import {DELETE_PROCESS} from "../../Store/constant";
import axios from 'axios';

const style = {
  margin: 12,
};

class InProcess extends Component {
  constructor(props) {
    super(props);
    this.state = {
      all_process: this.props.proc
    }

  }

  deleteOneProcess(pr){
    axios.post('/delete_process', {process: pr})
      .then(function (response) {
        let body = response.data['status'];
        console.log('delete ===>', body);
      })
      .catch(function (error) {
        console.log(error);
      });
    this.props.deleteOne(pr);
  }

  oneProcess = (process) => {
    return (
      <div>
        <div>
          <div>
            <div className="dateD">{process.data}</div>
            <h4>CLIENT:</h4>
            <div>Full Name: {process.client.fname} {process.client.sname}</div>
            <div>Email: {process.client.email} </div>
            <div>Phone: {process.client.phone_number} </div>
            <div>City: {process.client.city} </div>
            <div>Street: {process.client.address} </div>
          </div>
          <div>
            <h4>PARTNER:</h4>
            <div>Full Name: {process.partner.fname} {process.partner.sname}</div>
            <div>Email: {process.partner.email} </div>
            <div>Phone: {process.partner.phone_number} </div>
            <div>City: {process.partner.city} </div>
            <div>Street: {process.partner.address} </div>
          </div>
          <div><h4>PROBLEM: </h4>{process.problem} </div>
        </div>
        <div className="oneProcessButton">
          <RaisedButton
            label="DELETE"
            icon={<Delete/>}
            backgroundColor="#E53935"
            labelColor="#fff"
            style={style}
            onClick={this.deleteOneProcess.bind(this,process)}
          />
          <RaisedButton
            label="DONE"
            backgroundColor="#388E3C"
            labelColor="#fff"
            icon={<Done/>}
            style={style}
            onClick={() => {
              console.log("processOne", process);
            }}
          />
        </div>
      </div>
    )
  };

  render() {

    return (
      <div className="in_process">
        {Object.keys(this.state.all_process).length ?
          <div>
            {this.state.all_process.map(process =>
              <Paper key={process.data}
                     className="paper_process"
                     zDepth={2}
                     rounded={false}
                     children={this.oneProcess(process)}
              />
            )}
          </div> :
          <div>
            <h1 className="not_process"> There is not one open process </h1>

          </div>}

      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    clients: state.reducerClients,
    main: state.reducerMain
  }
};

export default connect(mapStateToProps
  , dispatch => ({
    deleteOne: (process) => {
      dispatch({type: DELETE_PROCESS, payload: process})
    }
  })
)(InProcess)