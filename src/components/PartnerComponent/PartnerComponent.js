import React, {Component} from 'react';
import axios from 'axios';
import {TextField} from 'material-ui';

class PartnerComponent extends Component {
  constructor() {
    super();
    this.state = {
      users: []
    }

  }

  componentWillMount() {
    this.setUsers();
  }

  render() {
    const users = this.state.users;
    const usersView = this.getUsersView(users);
    return (
      <div className="clients">
        <TextField
          hintText="Partners"
          floatingLabelText="find partners:"
        /><br />
        {usersView}
      </div>
    )
  }

  setUsers() {
    let self = this;
    axios.get('/get_users')
      .then(function (response) {
        self.setState({users: response.data['partners']})
      })
      .catch(function (error) {
        console.log(error);
      });
    console.log(this.state.users);
  }

  getUsersView(users) {
    const usersView = users.map(user =>
      <div key={user.name}>
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
}

export default PartnerComponent;