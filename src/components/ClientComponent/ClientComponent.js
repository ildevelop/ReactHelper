import React from 'react'
import './ClientComponent.scss'
import {TextField} from "material-ui";

export class ClientComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'Hello',
    };
  }
  handleChange = (event) => {
    this.setState({
      value: event.target.value,
    });
  };

  render() {

    return (
      <div className="Clientstyle">
        <div className="leftSide">
          <TextField
            hintText="Hint Text"
            floatingLabelText="Search Client:"
            value={this.state.value}
            onChange={this.handleChange}
          />
        </div>
        <div className="rightSide">

        </div>
      </div>
    )
  }
}

export default ClientComponent