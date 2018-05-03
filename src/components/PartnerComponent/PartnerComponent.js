import React, {Component} from 'react';
import {RadioButton, TextField} from 'material-ui';
import './../ClientComponent/ClientComponent.scss';
import {connect} from 'react-redux'
import {REMOVE_ONE_PARTNER, SET_ONE_PARTNER} from '../../Store/constant';
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
      partners: this.props.part || [],
      searchUsers: [],
      displayRowCheckbox: this.props.check || false,
    }
  }

  componentDidMount() {
    this.setState({searchUsers: this.state.partners});

  }

  filterList(event) {
    let updatedList = this.state.partners;
    let username = updatedList.filter(
      user => user.fname.search(event.target.value) !== -1 ||
        user.city.search(event.target.value) !== -1 ||
        user.phone_number.search(event.target.value) !== -1 ||
        user.zipp.search(event.target.value) !== -1 ||
        user.category.search(event.target.value) !== -1
    );
    this.setState({searchUsers: username});
  }

  handleSelect = (user) => {
    const checkedUser = this.state.searchUsers[user];
    if (!this.props.partners.partner.includes(checkedUser)) {
      this.props.AddOnePartner(checkedUser);
    } else {
      this.props.RemoveOnePartner(checkedUser);
    }
  };

  render() {
    const {searchUsers} = this.state;
    return (
      <div className="clients">
        <Table onCellClick={this.handleSelect.bind(this)}>
          <TableHeader adjustForCheckbox={this.state.displayRowCheckbox}
                       displaySelectAll={this.state.displayRowCheckbox}>
            <TableRow>
              <TableHeaderColumn><TextField
                hintText="Partners"
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
              <TableHeaderColumn>Categories</TableHeaderColumn>
              <TableHeaderColumn>N-: processes</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {searchUsers && searchUsers.map((user, key) => <TableRow
              key={user._id} style={user.chatId ? {color: '#388E3C'} : {color: '#000'}}
            >
              <TableRowColumn>
                {this.props.check ? <RadioButton
                  checked={this.props.partners.partner.includes(user) && true}
                  value={user._id}
                /> : <div/>}
              </TableRowColumn>
              <TableRowColumn>{user.fname}</TableRowColumn>
              <TableRowColumn>{user.sname}</TableRowColumn>
              <TableRowColumn>{user.address}</TableRowColumn>
              <TableRowColumn>{user.zipp}</TableRowColumn>
              <TableRowColumn>{user.city}</TableRowColumn>
              <TableRowColumn>{user.email}</TableRowColumn>
              <TableRowColumn>{user.phone_number}</TableRowColumn>
              <TableRowColumn>{user.commission}</TableRowColumn>
              <TableRowColumn>{user.category}</TableRowColumn>
              <TableRowColumn>{user.work_process_id.length}</TableRowColumn>

            </TableRow>)}
          </TableBody>

        </Table>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    partners: state.reducerPartners
  }
};
export default connect(mapStateToProps, dispatch => ({
  AddOnePartner: (client) => {
    dispatch({type: SET_ONE_PARTNER, payload: client})
  },
  RemoveOnePartner: (client) => {
    dispatch({type: REMOVE_ONE_PARTNER, payload: client})
  }
}))(PartnerComponent);