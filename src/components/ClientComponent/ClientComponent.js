import React, {Component} from 'react';
import {TextField} from 'material-ui';
import './ClientComponent.scss'

class ClientComponent extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
      searchUsers:[],
      searhname: ''
    }

  }

  componentDidMount() {
    this.setState({searchUsers:this.state.users});

  }
  componentWillMount() {
    this.setState({users:this.props.users});

  }
  filterList(event){
    var updatedList = this.state.users;
    var username = updatedList.filter(
      user => user.fname.search(event.target.value) !== -1 ||
          user.city.search(event.target.value) !== -1 ||
          user.phone_number.search(event.target.value) !== -1
    );
    console.log("Result:",username);
    this.setState({searchUsers: username});
  }

  getUsersView(users) {
    const usersView = users.map(user =>
      <div key={user.id}>
        <ul>
          <li>First name: {user.fname}</li>
          <li>Second name:{user.sname}</li>
          <li>Street: {user.address}</li>
          <li>PC: {user.PC}</li>
          <li>City: {user.city}</li>
          <li>Country: {user.country}</li>
          <li>Phone: {user.phone_number}</li>
          <li>Commission: {user.commission}</li>
        </ul>

      </div>
    );
    return usersView;
  }
  render() {
    const usersView = this.getUsersView(this.state.searchUsers);
    return (
      <div className="clients">
        <TextField
          hintText="Clients"
          floatingLabelText="find clients:"
          onChange={this.filterList.bind(this)}
        /><br />
        {usersView}
      </div>
    )
  }
}

export default ClientComponent;