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
import ClientComponent from '../ClientComponent/ClientComponent';
import PartnerComponent from '../PartnerComponent/PartnerComponent';
import Popover from 'material-ui/Popover';
import NewIntervention from "../NewIntervention/NewIntervention";
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

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

const CLIENTS = 'clients';
const PARTNERS = 'partners';
const INPROCESS = 'inProcess';
const DONE ='done';

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
      open : false,
      popUpLabel : null,
      isNewClients: false,
      isNewPartners: false,
      isNewProcess: false,
      openIntervention : false
    };
    // this.handleIntervention = this.handleIntervention.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.setUsers(CLIENTS);
    this.setUsers(PARTNERS);
  }

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };

  switcher() {
    switch (this.state.curentState) {
      case CLIENTS:
        return ( <ClientComponent users={this.state.clients}/>);
      case PARTNERS:
        return (<PartnerComponent partners={this.state.partners}/>);
      case INPROCESS:
        return (<h2>Hello InProcess</h2>);
      case DONE:
        return (<h2>Hello Done</h2>);
      // case "NewIntervention":
      //   switch (this.state.curentStateNewIntervention) {
      //     case "newClients":
      //       return ( <NewIntervention position="Clients" open={true}/>);
      //     case "newPartner":
      //       return (<NewIntervention position="Partner" open={true}/>);
      //     case "newProcess":
      //       return (<NewIntervention position="Process" open={true}/>);
      //   }
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
    if (qw == CLIENTS) {
      this.setUsers(CLIENTS);
      this.setState({
        isClients: true,
        isPartners: false,
        isInProcess: false,
        isDone: false,
        isNewIntervention: false
      })
    }
    if (qw == PARTNERS) {
      this.setUsers(PARTNERS);
      this.setState({
        isClients: false,
        isPartners: true,
        isInProcess: false,
        isDone: false,
        isNewIntervention: false
      })
    }
    if (qw == INPROCESS) {
      this.setState({
        isClients: false,
        isPartners: false,
        isInProcess: true,
        isDone: false,
        isNewIntervention: false
      })
    }
    if (qw == DONE) {
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
    this.setState({openIntervention : true, open : false, popUpLabel : qw});
  }

  handleClose(){
    this.setState({openIntervention : false});
  }

  render() {
    const actions = [

      <FlatButton key ={1000}
        label="Cancel"
        primary={true}
        onClick={this.handleClose}
      />,
      <FlatButton key ={2000}
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onClick={this.handleClose}
      />
    ];

    return ([
        <div key ={3000}>
          <Paper style={style.paper}>
            <Menu >
              <MenuItem primaryText="clients" rightIcon={<Assistant/>}
                        onClick={this.onClickMenu.bind(this, CLIENTS)}/>
              <Divider />
              <MenuItem  primaryText="Partners" rightIcon={<Partners/>}
                        onClick={this.onClickMenu.bind(this, PARTNERS)}/>
              <Divider />
              <MenuItem primaryText="In Process" to="/in_process" rightIcon={<Process/>}
                        onClick={this.onClickMenu.bind(this, INPROCESS)}/>
              <Divider />
              <MenuItem  primaryText="Done" to="/done" rightIcon={<Done/>} onClick={this.onClickMenu.bind(this, DONE)}/>
              <Divider />
              <MenuItem

                primaryText="New Intervention" to="/new_intervention" rightIcon={<Add/>}
                onClick={this.handleClick}
              />
              <Popover
                open={this.state.open}
                anchorEl={this.state.anchorEl}
                anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                targetOrigin={{horizontal: 'left', vertical: 'top'}}
                onRequestClose={this.handleRequestClose}
              >
                <Menu >
                  <MenuItem

                    primaryText="Add new Client"
                    onClick={this.onClickAddNew.bind(this, CLIENTS)}
                    rightIcon={<AddNew hoverColor="#23822e" color="#2cde41"/>}/>
                  <MenuItem
                    primaryText="Add new Partners"
                    onClick={this.onClickAddNew.bind(this, PARTNERS)}
                    rightIcon={<AddNew hoverColor="#23822e" color="#2cde41"/>}/>
                  <MenuItem
                    primaryText="Add new Process"
                    onClick={this.onClickAddNew.bind(this, INPROCESS)}
                    rightIcon={<AddNew hoverColor="#23822e" color="#2cde41"/>}/>
                </Menu>
              </Popover>
            </Menu>
          </Paper>
        </div>,
        <div key={4000}>{ this.switcher()}</div>,
        <Dialog key ={5000}
          actions={actions}
          modal={false}
          open={this.state.openIntervention}
          onRequestClose={this.handleClose}
          children={
            <div>
              <h2 >
                Add new {this.state.popUpLabel}:
              </h2>
              <TextField  hintText="Bob" floatingLabelText="Your name"/>
              <br />
              <TextField hintText="Israel Tel Aviv" floatingLabelText="Your Address"/>
              <br />
              <TextField hintText="bob@gmail.com" floatingLabelText="Your E-mail "/>
              <br />
            </div>
          }
        />
      ]
    )
  }
}

export default Dashboard
