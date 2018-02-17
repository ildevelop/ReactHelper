import React, {Component} from 'react';
import './Done.scss'
import {Paper} from "material-ui";

class Done extends Component {
  constructor(props) {
    super(props);
    this.state = {
      all_done: this.props.done || []
    }

  }

  render() {
    return (
      <div className="done_main">
        {Object.keys(this.state.all_done).length ?
          <div>
            {this.state.all_process.map(process =>
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