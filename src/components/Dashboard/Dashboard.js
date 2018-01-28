import React from 'react';
import Paper from 'material-ui/Paper';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import Assistant from 'material-ui/svg-icons/action/account-circle';
import Add from 'material-ui/svg-icons/action/add-shopping-cart';
import Done from 'material-ui/svg-icons/maps/beenhere';
import Process from 'material-ui/svg-icons/maps/local-shipping';
import Partners from 'material-ui/svg-icons/communication/business';
import axios from 'axios';

import ClientComponent from '../ClientComponent/ClientComponent';
import PartnerComponent from '../PartnerComponent/PartnerComponent';

const style = {
  paper: {
    backgroundColor: '#eee',
    display: 'inline-block',
    float: 'left'
  },
  rightIcon: {
    textAlign: 'center',
    lineHeight: '24px',
  },
};

class Dashboard extends React.Component {
  constructor() {
    super();
    this.state = {
      clients : [],
      partners : [],
      curentState: '',
      isClients: false,
      isPartners: false,
      isInProcess: false,
      isDone: false,
      isNewIntervention: false
    };

    this.setUsers('clients');
    this.setUsers('partners');
  }

  switcher() {
    switch (this.state.curentState) {
      case "clients":
        return( <ClientComponent users={this.state.clients}/>);
      case "Partners":
        return(<PartnerComponent partners={this.state.partners}/>);
      case "InProcess":
        return(<h2>Hello InProcess</h2>);
      case "Done":
        return(<h2>Hello Done</h2>);
      case "NewIntervention":
        return(<h2>Hello NewIntervention</h2>);
    }
  }
  setUsers(par) {
    let self = this;
    axios.get('/get_users')
      .then(function (response) {
        self.setState({ [par] : response.data[par]})
      })
      .catch(function (error) {
        console.log(error);
      });
  }


  onClickMenu(qw) {
    this.setState({curentState: qw});
    if (qw == "clients") {
      this.setUsers('clients');
      this.setState({
        isClients: true,
        isPartners: false,
        isInProcess: false,
        isDone: false,
        isNewIntervention: false
      })
    }
    if (qw == "Partners") {
      this.setUsers('partners');
      this.setState({
        isClients: false,
        isPartners: true,
        isInProcess: false,
        isDone: false,
        isNewIntervention: false
      })
    }
    if (qw == "InProcess") {
      this.setState({
        isClients: false,
        isPartners: false,
        isInProcess: true,
        isDone: false,
        isNewIntervention: false
      })
    }
    if (qw == "Done") {
      this.setState({
        isClients: false,
        isPartners: false,
        isInProcess: false,
        isDone: true,
        isNewIntervention: false
      })
    }
    if (qw == "NewIntervention") {
      this.setState({
        isClients: false,
        isPartners: false,
        isInProcess: false,
        isDone: false,
        isNewIntervention: true
      })
    }
  }

  render() {
    return (
      <div>
        <Paper style={style.paper}>
          <Menu>
            <MenuItem primaryText="clients" rightIcon={<Assistant/>}
                      onClick={this.onClickMenu.bind(this, "clients")}/>
            <Divider/>
            <MenuItem primaryText="Partners" rightIcon={<Partners/>}
                      onClick={this.onClickMenu.bind(this, "Partners")}/>
            <Divider/>
            <MenuItem primaryText="In Process" to="/in_process" rightIcon={<Process/>}
                      onClick={this.onClickMenu.bind(this, "InProcess")}/>
            <Divider/>
            <MenuItem primaryText="Done" to="/done" rightIcon={<Done/>} onClick={this.onClickMenu.bind(this, "Done")}/>
            <Divider/>
            <MenuItem primaryText="New Intervention" to="/new_intervention" rightIcon={<Add/>}
                      onClick={this.onClickMenu.bind(this, "NewIntervention")}/>
          </Menu>
        </Paper>

        {
          this.switcher()
        }
      </div>
    )
  }
}

export default Dashboard
