import React, {Component} from 'react';
import './Done.scss'
import {Paper, RaisedButton} from "material-ui";
import Delete from 'material-ui/svg-icons/action/delete';
import axios from 'axios';
import {connect} from 'react-redux'
import {DELETE_DONE} from "../../Store/constant";
const style = {
  margin: 12,
};

class Done extends Component {

  deleteOneProcess(pr){
    console.log('deleteOneProcess',pr);
    this.props.deleteOneDone(pr._id);
    axios.post('/delete_done_process', {done_process: pr})
      .then(function (response) {
        let body = response.data['status'];
        console.log('delete ===>', body);
      })
      .catch(function (error) {
        console.log(error);
      });
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
export default connect( mapStateToProps,dispatch => ({
    deleteOneDone: (process) => {
      const asyncDeleteDone = () => dispatch => {
        dispatch({type: DELETE_DONE, payload: process})};
      dispatch(asyncDeleteDone());
  },
})
)(Done)