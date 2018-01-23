import React, {Component} from 'react';
import {TextField} from 'material-ui';
import './ClientComponent.scss'
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

class ClientComponent extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
      searchUsers:[],
      displayRowCheckbox: false
    }
  }

  componentDidMount() {
    this.setState({searchUsers:this.state.users});

  }
  componentWillMount() {
    this.setState({users:this.props.users});

  }
  filterList(event){
    let updatedList = this.state.users;
    let username = updatedList.filter(
      user => user.fname.search(event.target.value) !== -1 ||
          user.city.search(event.target.value) !== -1 ||
          user.phone_number.search(event.target.value) !== -1
    );
    this.setState({searchUsers: username});
  }

  getUsersView(users) {
    const usersView = users.map(user =>
        <TableRow key={user.id}>
          <TableRowColumn></TableRowColumn>
          <TableRowColumn>{user.fname}</TableRowColumn>
          <TableRowColumn>{user.sname}</TableRowColumn>
          <TableRowColumn>{user.address}</TableRowColumn>
          <TableRowColumn>{user.zipp}</TableRowColumn>
          <TableRowColumn>{user.city}</TableRowColumn>
          <TableRowColumn>{user.country}</TableRowColumn>
          <TableRowColumn>{user.phone_number}</TableRowColumn>
        </TableRow>

    );
    return usersView;
  }
  render() {
    const usersView = this.getUsersView(this.state.searchUsers);
    return (
      <div className="clients">

        <Table >
          <TableHeader adjustForCheckbox= {this.state.displayRowCheckbox} displaySelectAll ={this.state.displayRowCheckbox}>
            <TableRow >
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
              <TableHeaderColumn>City</TableHeaderColumn>
              <TableHeaderColumn>Country</TableHeaderColumn>
              <TableHeaderColumn>Zip</TableHeaderColumn>
              <TableHeaderColumn>Phone</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox= {this.state.displayRowCheckbox}>
            {usersView}
          </TableBody>

        </Table>

      </div>
    )
  }
}

export default ClientComponent;