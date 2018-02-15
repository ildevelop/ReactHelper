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
import './Dashboard.scss'
import NewProcessComponent from '../NewProcessComponent/NewProcessComponent';
import {connect} from 'react-redux'
import {SET_CLIENTS, SET_PARTNERS, HANDLE_DIALOG} from './../../Store/constant'
import CreateNewClient from '../NewProcessComponent/CreateNewClient';

const CLIENTS = 'clients',
  PARTNERS = 'partners',
  INPROCESS = 'inProcess',
  DONE = 'done',
  INNEWPROCESS = 'inNewProcess';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
      newProccess: false,
    };
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
        return ( <ClientComponent users={this.props.clients} check={false}/>);
      case PARTNERS:
        return (<PartnerComponent part={this.props.partners} check={false}/>);
      case INPROCESS:
        return (<h2>Hello InProcess</h2>);
      case DONE:
        return (<h2>Hello Done</h2>);
      case INNEWPROCESS:
        return (<NewProcessComponent
          clients={this.props.clients}
          partners={this.props.partners} />);
    }
  }

  setPartners() {
    let self = this;
    axios.get('/get_partners')
      .then(function (response) {
        self.props.AddPartners(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  setClients() {
    let self = this;
    axios.get('/get_clients')
      .then(function (response) {
        self.props.AddClients(response.data);
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
    this.setState({open: false, popUpLabel: "Add new " + qw});
    this.props.HandleDialog(true);

  }

  render() {
    return [<div key={3000}>
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
      <CreateNewClient key={88} popUpLabel={this.state.popUpLabel}/>
    ]
  }
}

const mapStateToProps = (state) => {
  return {
    clients: state.reducerClients.clients,
    partners: state.reducerPartners.partners,
    main: state.reducerMain
  }
};


export default connect(mapStateToProps, dispatch => ({
  AddClients: (clients) => {
    const asyncGetClients = () => dispatch => {
      dispatch({type: SET_CLIENTS, payload: clients})
    };
    dispatch(asyncGetClients());
  },
  AddPartners: (partners) => {
    const asyncGetPartners = () => dispatch => {
      dispatch({type: SET_PARTNERS, payload: partners})
    };
    dispatch(asyncGetPartners());
  },

  HandleDialog: (val) => {
    dispatch({type: HANDLE_DIALOG, payload: val})

  }
}))(Dashboard)
