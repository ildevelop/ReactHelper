import React, {Component} from 'react';
import './Done.scss'
import {Paper, RaisedButton} from "material-ui";
import Delete from 'material-ui/svg-icons/action/delete';
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux';
import * as mainActions from '../../Actions/MainActions';
const style = {
  margin: 12,
};

class Done extends Component {

  deleteOneProcess(pr){
    console.log('deleteOneProcess',pr);
    this.props.deleteDone(pr)
  }
  oneProcess = (process) => {
    return (
      <div>
        <div>
          <div>
            <div className="dateS">{process.data}</div>
            <div className="dateF">{process.finish_data}</div>
            <h4>CLIENT:</h4>
            <div>Full Name: {process.client.fname} {process.client.sname}</div>
            <div>Email: {process.client.email} </div>
            <div>Phone: {process.client.phone_number} </div>
            <div>City: {process.client.city} </div>
            <div>Street: {process.client.address} </div>
          </div>
          <div className="partners">
            <h4>PARTNER:</h4>
            {process.partner.map((partner,key) =>
                  <div  key ={partner._id}>{key+1} - Full Name: {partner.fname} {partner.sname}</div>
              )
            }
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
        </div>
      </div>
    )
  };
  render() {
    console.log("all_done:", this.props.main);
    return (
      <div className="done_main">
        {Object.keys(this.props.main).length ?
          <div>
            {this.props.main.map(process =>
              <Paper key={process._id}
                     className="paper_process"
                     zDepth={2}
                     rounded={false}
                     children={this.oneProcess(process)}
              />
            )}
          </div> :
          <div>
            <h1 className="not_process"> You did`t have a completed process </h1>
          </div>}

      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    main: state.reducerMain.done_process
  }
};
function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(mainActions, dispatch)
  }
}
export default connect( mapStateToProps,mapDispatchToProps)(Done)