import React from 'react';
import Paper from 'material-ui/Paper';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import Assistant from 'material-ui/svg-icons/action/account-circle';
import Add from 'material-ui/svg-icons/action/add-shopping-cart';
import AddNew from 'material-ui/svg-icons/content/add-circle-outline';
import Done from 'material-ui/svg-icons/maps/beenhere';
import Process from 'material-ui/svg-icons/maps/local-shipping';
import Partners from 'material-ui/svg-icons/communication/business';
import axios from 'axios';
import RaisedButton from 'material-ui/RaisedButton';
import ClientComponent from '../ClientComponent/ClientComponent';
import PartnerComponent from '../PartnerComponent/PartnerComponent';
import Popover from 'material-ui/Popover';

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
      clients: [],
      partners: [],
      curentState: '',
      curentStateNewIntervention:'',
      isClients: false,
      isPartners: false,
      isInProcess: false,
      isDone: false,
      isNewIntervention: false,
      open: false,
      isNewClients: false,
      isNewPartners: false,
      isNewProcess: false,
    };

    this.setUsers('clients');
    this.setUsers('partners');
  }

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };

  switcher() {
    switch (this.state.curentState) {
      case "clients":
        return ( <ClientComponent users={this.state.clients}/>);
      case "Partners":
        return (<PartnerComponent partners={this.state.partners}/>);
      case "InProcess":
        return (<h2>Hello InProcess</h2>);
      case "Done":
        return (<h2>Hello Done</h2>);
      case "NewIntervention":
        switch (this.state.curentStateNewIntervention) {
          case "newClients":
            return ( <div>2 hello clients</div>);
          case "newPartner":
            return (<div>2 hello partner</div>);
          case "newProcess":
            return (<div>2 hello process</div>);
        }
    }
  }

  setUsers(par) {
    let self = this;
    axios.get('/get_users')
      .then(function (response) {
        self.setState({[par]: response.data[par]})
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
  }
  handleClick = (event) => {
    // This prevents ghost click.
    event.preventDefault();
    this.setState({
      curentState: 'NewIntervention',
      isClients: false,
      isPartners: false,
      isInProcess: false,
      isDone: false,
      isNewIntervention: true,
      open: true,
      anchorEl: event.currentTarget,

    })
  };
  onClickAddNew(qw) {
    this.setState({curentStateNewIntervention: qw});
    if (qw == "newClients") {
      this.setState({
        isNewClients: true,
        isNewPartners: false,
        isNewProcess: false,
      })
    }
    if (qw == "newPartner") {
      this.setState({
        isNewClients: false,
        isNewPartners: true,
        isNewProcess: false,
      })
    }
    if (qw == "newProcess") {
      this.setState({
        isNewClients: false,
        isNewPartners: false,
        isNewProcess: true,
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
            <MenuItem
              primaryText="New Intervention" to="/new_intervention" rightIcon={<Add/>}
              onClick={this.handleClick}
              label="Click me"
            />
            <Popover
              open={this.state.open}
              anchorEl={this.state.anchorEl}
              anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
              targetOrigin={{horizontal: 'left', vertical: 'top'}}
              onRequestClose={this.handleRequestClose}
            >
              <Menu>
                <MenuItem
                  primaryText="Add new Client"
                  onClick={this.onClickAddNew.bind(this, "newClients")}
                  rightIcon={<AddNew hoverColor="#23822e" color="#2cde41"/>}/>
                <MenuItem
                  primaryText="Add new Partners"
                  onClick={this.onClickAddNew.bind(this, "newPartner")}
                  rightIcon={<AddNew hoverColor="#23822e" color="#2cde41"/>}/>
                <MenuItem
                  primaryText="Add new Process"
                  onClick={this.onClickAddNew.bind(this, "newProcess")}
                  rightIcon={<AddNew hoverColor="#23822e" color="#2cde41"/>}/>
              </Menu>
            </Popover>
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
