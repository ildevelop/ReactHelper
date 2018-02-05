import React, {Component} from 'react';
import {TextField} from 'material-ui';
import './PartnerComponent.scss';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

class PartnerComponent extends Component {
  constructor() {
    super();
    this.state = {
      partners: [],
      searchUsers:[],
      displayRowCheckbox: false
    }
  }

  componentDidMount() {
    this.setState({searchUsers:this.state.partners});

  }
  componentWillMount() {
    this.setState({partners:this.props.partners});

  }
  filterList(event){
    let updatedList = this.state.partners;
    let username = updatedList.filter(
      user => user.fname.search(event.target.value) !== -1 ||
        user.city.search(event.target.value) !== -1 ||
        user.phone_number.search(event.target.value) !== -1);
    this.setState({searchUsers: username});
  }

  getUsersView(users) {
    const usersView = users.map(user =>
      <TableRow key={user._id}>
        <TableRowColumn></TableRowColumn>
        <TableRowColumn>{user.fname}</TableRowColumn>
        <TableRowColumn>{user.sname}</TableRowColumn>
        <TableRowColumn>{user.address}</TableRowColumn>
        <TableRowColumn>{user.zipp}</TableRowColumn>
        <TableRowColumn>{user.city}</TableRowColumn>
        <TableRowColumn>{user.email}</TableRowColumn>
        <TableRowColumn>{user.phone_number}</TableRowColumn>
        <TableRowColumn>{user.commission}</TableRowColumn>
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
              <TableHeaderColumn>Zip</TableHeaderColumn>
              <TableHeaderColumn>Email</TableHeaderColumn>
              <TableHeaderColumn>Phone</TableHeaderColumn>
              <TableHeaderColumn>Commission</TableHeaderColumn>
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

export default PartnerComponent;