import React, {Component} from 'react';
import './Done.scss'
import {Paper, RaisedButton} from "material-ui";
import Delete from 'material-ui/svg-icons/action/delete';

const style = {
  margin: 12,
};

class Done extends Component {
  constructor(props) {
    super(props);
    this.state = {
      all_done: this.props.done
    }

  }

  oneProcess = (process) => {
    console.log('process::::',process);
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

          />

        </div>
      </div>
    )
  };
  render() {
    let dn =this.state.all_done;
    console.log("DONE:",dn);
    return (
      <div className="done_main">
        {Object.keys(this.state.all_done[0]).length ?
          <div>
            {this.state.all_done[0].map(process =>
              <Paper key={process.data}
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

export default Done