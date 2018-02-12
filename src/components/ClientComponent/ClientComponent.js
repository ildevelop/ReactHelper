import React, {Component} from 'react';
import {RadioButton, RadioButtonGroup, TextField} from 'material-ui';
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
import ClientItem from "./ClientItem/ClientItem";

class ClientComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: this.props.users || [],
      searchUsers: [],
      displayRowCheckbox: this.props.check || false,
      checked: null
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


  // getUsersView(users) {
  //   const usersView = users.map((user) =>
  //     <TableRow key={user._id} ref="tableRow">
  //       <TableRowColumn></TableRowColumn>
  //       <TableRowColumn>{user.fname}</TableRowColumn>
  //       <TableRowColumn>{user.sname}</TableRowColumn>
  //       <TableRowColumn>{user.address}</TableRowColumn>
  //       <TableRowColumn>{user.zipp}</TableRowColumn>
  //       <TableRowColumn>{user.city}</TableRowColumn>
  //       <TableRowColumn>{user.email}</TableRowColumn>
  //       <TableRowColumn>{user.phone_number}</TableRowColumn>
  //     </TableRow>
  //   );
  //   return usersView;
  // }

  // handleCellClick(row) {
  //   console.log('row',row);
  //   this.setState({selectedClient:this.state.searchUsers[row]});
  //   this.props.AddOneClients(this.state.selectedClient);
  //   console.log(this.state.selectedClient);
  // }

  handleSelect = (user) => {
    const checkedUser = this.state.searchUsers[user];
    this.setState({
      checked: checkedUser._id
    });
    this.props.AddOneClients(checkedUser);
  };

  render() {
    // const usersView = this.getUsersView(this.state.searchUsers);
    const {searchUsers, checked} = this.state;
    return (
      <div className="clients">
        <Table
          onCellClick={this.handleSelect.bind(this)}
        >
          <TableHeader>
            <TableRow>
              <TableHeaderColumn><TextField
                hintText="Clients"
                className="textField"
                floatingLabelText="find clients:"
                onChange={this.filterList.bind(this)}
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
          <TableBody displayRowCheckbox={false}>
            {/*{usersView}*/}
            {searchUsers && searchUsers.map(user => <TableRow
              key={user._id}
              >
              <TableRowColumn>
              <RadioButton
              checked={checked === user._id && true}
              value={user._id}
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
              </TableRow>)}
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
    dispatch({type: SET_ONE_CLIENTS, payload: client})
  }
}))(ClientComponent);