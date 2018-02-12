import React, {Component} from 'react';
import {RadioButton, TableRow, TableRowColumn} from "material-ui";

export default class ClientItem extends Component {
  constructor() {
    super();
    this.state = {

    }
  }

  handleClick = (e) => {
    console.log(e);
    console.log(this.props.user);

    // this.props.onRowClick(this.props.user);
  };

  render() {
    const {user, onRowClick, isChecked} = this.props;
    return (
      <TableRow
        onRowClick={(e) => this.handleClick(e)}
      >
        <TableRowColumn>
          <RadioButton
            // onCheck={onRowClick(user)}
            value={user._id}
            checked={isChecked}
          />
        </TableRowColumn>
        <TableRowColumn/>
        <TableRowColumn>{user.fname}</TableRowColumn>
        <TableRowColumn>{user.sname}</TableRowColumn>
        <TableRowColumn>{user.address}</TableRowColumn>
        <TableRowColumn>{user.zipp}</TableRowColumn>
        <TableRowColumn>{user.city}</TableRowColumn>
        <TableRowColumn>{user.email}</TableRowColumn>
        <TableRowColumn>{user.phone_number}</TableRowColumn>
      </TableRow>
    )
  }
}
