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
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import './Dashboard.scss'
import NewProcessComponent from "../NewProcessComponent/NewProcessComponent";

const CLIENTS = 'clients',
  PARTNERS = 'partners',
  INPROCESS = 'inProcess',
  DONE = 'done',
  INNEWPROCESS = 'inNewProcess';

class Dashboard extends React.Component {
  constructor() {
    super();
    this.state = {
      clients: [],
      partners: [],
      curentState: '',
      curentStateNewIntervention: '',
      isClients: false,
      isPartners: false,
      isInProcess: false,
      isDone: false,
      isNewIntervention: false,
      open: false,
      popUpLabel: null,
      isNewClients: false,
      isNewPartners: false,
      isNewProcess: false,
      openIntervention: false,
      newProccess: false,
    };
    this.handleClose = this.handleClose.bind(this);
    this.setClients();
    this.setPartners();

  }

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };

  switcher() {
    switch (this.state.curentState) {
      case CLIENTS:
        return ( <ClientComponent users={this.state.clients} check ={false}/>);
      case PARTNERS:
        return (<PartnerComponent partners={this.state.partners}/>);
      case INPROCESS:
        return (<h2>Hello InProcess</h2>);
      case DONE:
        return (<h2>Hello Done</h2>);
      case INNEWPROCESS:
        return (<NewProcessComponent clients = {this.state.clients} partners = {this.state.partners}/>);
    }
  }

  setPartners() {
    let self = this;
    axios.get('/get_partners')
      .then(function (response) {
        self.setState({partners: response.data});
        // self.setState({partners: response.data[1]['partners']});
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  setClients() {
    let self = this;
    axios.get('/get_clients')
      .then(function (response) {
        self.setState({clients: response.data});
        // self.setState({partners: response.data[1]['partners']});
      })
      .catch(function (error) {
        console.log(error);
      });
  }


  onClickMenu(qw) {
    this.setState({curentState: qw});
    if (qw === CLIENTS) {
      this.setClients();
      this.setState({
        isClients: true,
        isPartners: false,
        isInProcess: false,
        isDone: false,
        isNewIntervention: false,
        newProccess: false,
      })
    }
    if (qw === PARTNERS) {
      this.setPartners();
      this.setState({
        isClients: false,
        isPartners: true,
        isInProcess: false,
        isDone: false,
        isNewIntervention: false,
        newProccess: false,
      })
    }
    if (qw === INPROCESS) {
      this.setState({
        isClients: false,
        isPartners: false,
        isInProcess: true,
        isDone: false,
        isNewIntervention: false
      })
    }
    if (qw === DONE) {
      this.setState({
        isClients: false,
        isPartners: false,
        isInProcess: false,
        isDone: true,
        isNewIntervention: false,
        newProccess: false,
      })
    }
    if (qw === INNEWPROCESS) {
      this.setState({
        isClients: false,
        isPartners: false,
        isInProcess: false,
        isDone: false,
        isNewIntervention: false,
        newProccess: true,
        open: false,
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
      newProccess: false,

    })
  };


  onClickAddNew(qw) {
    this.setState({openIntervention: true, open: false, popUpLabel: "Add new " + qw});
  }

  /**
   *
   */
  handleOnSubmitClose() {
    let formData = {};
    Object.keys(this.refs).forEach((key) => formData[key] = this.refs[key].getValue());
    if(this.state.popUpLabel === "Add new clients"){
      axios.post('/add_client', {clients: formData})
        .then(function (response) {
          let body = response.data['status'];
          console.log('body ===>', body);
        })
        .catch(function (error) {
          console.log(error);
        });
      this.setState({openIntervention: false});
    }
    else {
      axios.post('/add_partners', {partners: formData})
        .then(function (response) {
          let body = response.data['status'];
          console.log('body ===>', body);
        })
        .catch(function (error) {
          console.log(error);
        });
      this.setState({openIntervention: false});
    }

  }

  handleClose() {
    this.setState({openIntervention: false});
  }

  render() {
    const actions = [

      <FlatButton key={1000}
                  label="Cancel"
                  primary={true}
                  onClick={this.handleClose}
      />,
      <FlatButton key={2000}
                  label="Submit"
                  type="submit"
                  primary={true}
                  keyboardFocused={true}
                  onClick={this.handleOnSubmitClose.bind(this)}
        // onSubmit={this.onSubmitDialog.bind(this)}
      />
    ];

    return ([
        <div key={3000}>
          <Paper className="paper">
            <Menu>
              <MenuItem primaryText="clients" rightIcon={<Assistant/>}
                        onClick={this.onClickMenu.bind(this, CLIENTS)}/>
              <Divider/>
              <MenuItem primaryText="Partners" rightIcon={<Partners/>}
                        onClick={this.onClickMenu.bind(this, PARTNERS)}/>
              <Divider/>
              <MenuItem primaryText="In Process" to="/in_process" rightIcon={<Process/>}
                        onClick={this.onClickMenu.bind(this, INPROCESS)}/>
              <Divider/>
              <MenuItem primaryText="Done" to="/done" rightIcon={<Done/>} onClick={this.onClickMenu.bind(this, DONE)}/>
              <Divider/>
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
                <Menu>
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
                    onClick={this.onClickMenu.bind(this, INNEWPROCESS)}
                    rightIcon={<AddNew hoverColor="#23822e" color="#2cde41"/>}/>
                </Menu>
              </Popover>
            </Menu>
          </Paper>
        </div>,
        <div key={4000}>{this.switcher()}</div>,

        <Dialog
          key={5000}
          title={this.state.popUpLabel}
          actions={actions}
          modal={false}
          open={this.state.openIntervention}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}

          children={
            <div className="textFieldMain">
              <div className="textField1">
                <TextField hintText="Bob" ref="fname" floatingLabelText="Your first name"
                />
                <br/>
                <TextField hintText="Amar" ref="sname" floatingLabelText="Your surname"
                />
                <br/>
                <TextField hintText="0549876543" ref="phone_number" floatingLabelText="Phone"
                />
                <br/>
                <TextField hintText="bob@gmail.com" ref="email" floatingLabelText="Your E-mail "
                />
                <br/>
              </div>
              <div className="textField2">
                <TextField hintText="Tel Aviv" ref="city" floatingLabelText="City"
                />
                <br/>
                <TextField hintText="Jabotinsky 25" ref="address" floatingLabelText="Street"
                />
                <br/>
                <TextField hintText="7750505" ref="zipp" floatingLabelText="ZIP"
                />
                <br/>
                {this.state.popUpLabel === "Add new partners" ?
                  <TextField hintText="30%" floatingLabelText="Commission"
                             ref="commission"
                  /> : <br/>}
              </div>


            </div>


          }
        />

      ]
    )
  }
}

export default Dashboard
