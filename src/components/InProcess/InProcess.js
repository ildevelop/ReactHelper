import React, {Component} from 'react';
import {Paper, RaisedButton} from "material-ui";
import {connect} from 'react-redux'
import Done from 'material-ui/svg-icons/action/done';
import Delete from 'material-ui/svg-icons/action/delete';
import './InProcess.scss'
import { bindActionCreators } from 'redux';
import * as mainActions from '../../Actions/MainActions';

const style = {
  margin: 12,
};

class InProcess extends Component {

  deleteOneProcess(pr){
    this.props.deleteProcess(pr);
  }
  addZero = (i) => {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  };
  DoneOneProcess(pr){
    let today = new Date();
    let h = this.addZero(today.getHours());
    let m = this.addZero(today.getMinutes());
    let date = today.getFullYear() + '-'
      + (today.getMonth() + 1) + '-'
      + today.getDate() + ' '
      + h + ':'
      + m;
    pr['finish_data'] = date;
    this.props.doneProcess(pr);
    this.props.deleteProcess(pr);
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
            onClick={this.DoneOneProcess.bind(this,process)}
          />
        </div>
      </div>
    )
  };

  render() {
    console.log("process:", this.props.proc);
    return (
      <div className="in_process">
        {Object.keys(this.props.proc).length ?
          <div>
            {this.props.proc.map(process =>
              <Paper key={process._id}
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

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(mainActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InProcess)