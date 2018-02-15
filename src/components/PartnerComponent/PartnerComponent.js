import React, {Component} from 'react';
import {RadioButton, TextField} from 'material-ui';
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
  constructor(props) {
    super(props);
    this.state = {
      partners: this.props.partners || [],
      searchUsers:[],
      displayRowCheckbox: this.props.check || false,
      checked: null
    }
  }

  componentDidMount() {
    this.setState({searchUsers:this.state.partners});

  }

  filterList(event) {
    let updatedList = this.state.partners;
    let username = updatedList.filter(
      user => user.fname.search(event.target.value) !== -1 ||
        user.city.search(event.target.value) !== -1 ||
        user.phone_number.search(event.target.value) !== -1 ||
        user.zipp.search(event.target.value) !== -1
    );
    this.setState({searchUsers: username});
  }

  render() {
    const {searchUsers, checked} = this.state;
    return (
      <div className="clients">
        <Table >
          <TableHeader adjustForCheckbox= {this.state.displayRowCheckbox} displaySelectAll ={this.state.displayRowCheckbox}>
            <TableRow >
              <TableHeaderColumn><TextField
                hintText="Clients"
                className="textField"
                floatingLabelText="find partners:"
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
          <TableBody displayRowCheckbox={false}>
            {searchUsers && searchUsers.map(user => <TableRow
              key={user._id}
            >
              <TableRowColumn>
                {this.props.check ?    <RadioButton
                  checked={checked === user._id && true}
                  value={user._id}
                />: <div/>}
              </TableRowColumn>
              <TableRowColumn>{user.fname}</TableRowColumn>
              <TableRowColumn>{user.sname}</TableRowColumn>
              <TableRowColumn>{user.address}</TableRowColumn>
              <TableRowColumn>{user.zipp}</TableRowColumn>
              <TableRowColumn>{user.city}</TableRowColumn>
              <TableRowColumn>{user.email}</TableRowColumn>
              <TableRowColumn>{user.phone_number}</TableRowColumn>
              <TableRowColumn>{user.commission}</TableRowColumn>
            </TableRow>)}
          </TableBody>

        </Table>
      </div>
    )
  }
}

export default PartnerComponent;