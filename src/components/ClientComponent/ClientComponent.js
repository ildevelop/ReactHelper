import React, {Component} from 'react';
import axios from 'axios';

class ClientComponent extends Component {
  constructor() {
    super();
    this.state = {
      users: []
    }

  }
  componentWillMount(){
    this.setUsers();
  }

  render() {
    const users = this.state.users;
    const usersView = this.getUsersView(users);
    return (
      <div>
        {usersView}
        </div>
    )
  }

  setUsers() {
    let self = this;
    axios.get('/get_users')
      .then(function (response) {
        self.setState({users: response.data['users']})
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  getUsersView(users) {
    const usersView = users.map(user =>
      <div key={user.name}><h1>
        {user.name}
    </h1>
  </div>
    )
    return usersView;
  }
}

export default ClientComponent;