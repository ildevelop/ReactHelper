import React, {Component} from 'react';
import {TextField} from 'material-ui';

class PartnerComponent extends Component {
  constructor() {
    super();
    this.state = {
      partners: [],
      searchUsers:[],
      searhname: ''
    }

  }

  componentDidMount() {
    this.setState({searchUsers:this.state.partners});

  }
  componentWillMount() {
    this.setState({partners:this.props.partners});

  }
  filterList(event){
    var updatedList = this.state.partners;
    var username = updatedList.filter(user => user.fname.search(event.target.value) !== -1);
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

export default PartnerComponent;