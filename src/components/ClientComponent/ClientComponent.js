import React, {Component} from 'react';
import {TextField} from 'material-ui';
import {connect} from 'react-redux'
import './ClientComponent.scss'
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import {SET_ONE_CLIENTS} from '../../Store/constant';

class ClientComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: this.props.users || [],
      searchUsers: [],
      displayRowCheckbox: this.props.check || false,

    }
  }

  componentDidMount() {
    this.setState({searchUsers: this.state.users});

  }

  filterList(event) {
    let updatedList = this.state.users;
    let username = updatedList.filter(
      user => user.fname.search(event.target.value) !== -1 ||
        user.city.search(event.target.value) !== -1 ||
        user.phone_number.search(event.target.value) !== -1 ||
        user.zipp.search(event.target.value) !== -1
    );
    this.setState({searchUsers: username});
  }


  getUsersView(users) {
    const usersView = users.map((user) =>
      <TableRow key={user._id} ref="tableRow">
        <TableRowColumn></TableRowColumn>
        <TableRowColumn>{user.fname}</TableRowColumn>
        <TableRowColumn>{user.sname}</TableRowColumn>
        <TableRowColumn>{user.address}</TableRowColumn>
        <TableRowColumn>{user.zipp}</TableRowColumn>
        <TableRowColumn>{user.city}</TableRowColumn>
        <TableRowColumn>{user.email}</TableRowColumn>
        <TableRowColumn>{user.phone_number}</TableRowColumn>
      </TableRow>
    );
    return usersView;
  }

  handleCellClick(row) {
    console.log('row',row);
    this.state.selectedClient= this.state.searchUsers[row];
    // this.props.AddOneClients(this.state.searchUsers[row]);
    console.log(this.state.selectedClient);
  }

  render() {
    const usersView = this.getUsersView(this.state.searchUsers);
    return (
      <div className="clients">

        <Table onCellClick={this.handleCellClick.bind(this)}>
          <TableHeader adjustForCheckbox={this.state.displayRowCheckbox}
                       displaySelectAll={this.state.displayRowCheckbox}>
            <TableRow>
              <TableHeaderColumn><TextField
                hintText="Clients"
                className="textField"
                floatingLabelText="find clients:"
                onChange={this.filterList.bind(this)
                }
              /></TableHeaderColumn>
              <TableHeaderColumn>First name</TableHeaderColumn>
              <TableHeaderColumn>Second name</TableHeaderColumn>
              <TableHeaderColumn>Street</TableHeaderColumn>
              <TableHeaderColumn>Zip</TableHeaderColumn>
              <TableHeaderColumn>City</TableHeaderColumn>
              <TableHeaderColumn>Email</TableHeaderColumn>
              <TableHeaderColumn>Phone</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={this.state.displayRowCheckbox}>
            {usersView}
          </TableBody>
        </Table>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    clients: state.reducerClients
  }
};
export default connect(mapStateToProps, dispatch => ({
  AddOneClients: (client) => {
    dispatch({type:SET_ONE_CLIENTS, payload:client})
  }
}))(ClientComponent);