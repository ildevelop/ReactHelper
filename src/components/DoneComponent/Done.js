import React, {Component} from 'react';
import './Done.scss'
import {Paper} from "material-ui";

class Done extends Component {
  constructor(props) {
    super(props);
    console.log('this.props',this.props.done);
    this.state = {
      all_done: this.props.done
    }

  }

  render() {
    let dn =this.state.all_done;
    console.log("DONE:",dn);
    return (
      <div className="done_main">
        {Object.keys(this.state.all_done).length ?
          <div>
            {this.state.all_done.map(process =>
              <Paper key={process.data}
                     className="paper_process"
                     zDepth={2}
                     rounded={false}
                     children={<div>child</div>}
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