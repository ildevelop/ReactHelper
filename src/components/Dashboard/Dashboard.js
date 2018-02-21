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
import ClientComponent from '../ClientComponent/ClientComponent';
import PartnerComponent from '../PartnerComponent/PartnerComponent';
import Popover from 'material-ui/Popover';
import './Dashboard.scss'
import NewProcessComponent from '../NewProcessComponent/NewProcessComponent';
import {connect} from 'react-redux'
import CreateNewClient from '../NewProcessComponent/CreateNewClient';
import InProcess from '../InProcess/InProcess';
import DoneComponent from './../DoneComponent/Done'
import {bindActionCreators} from 'redux';
import * as mainActions from '../../Actions/MainActions';
import Loading from './../Loading';

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
    this.props.setPartners();
    this.props.setClients();
    this.props.setProcess();
    this.props.setDone();
  }

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };

  switcher() {
    switch (this.state.curentState) {
      case CLIENTS:
        return ( <div>
          {this.props.loadingC ?
            <ClientComponent users={this.props.clients} check={false}/> :
            <Loading/>}
        </div>);
      case PARTNERS:
        return ( <div>
          {this.props.loadingP ?
            <PartnerComponent part={this.props.partners} check={false}/> :
            <Loading/>}
        </div>);
      case INPROCESS:

        return (<div>
          {this.props.loadingPr ?
            <InProcess proc={this.props.main}/> :
            <Loading/>}
        </div>);
      case DONE:
        return (<DoneComponent done={this.props.doneP}/>);
      case INNEWPROCESS:
        return (<NewProcessComponent
          clients={this.props.clients}
          partners={this.props.partners}/>);
    }
  }

  onClickMenu(qw) {
    this.setState({curentState: qw});
    if (qw === CLIENTS) {
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
    this.props.handleDialog(true);

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
    loadingC: state.reducerClients.loading,
    loadingP: state.reducerPartners.loading,
    loadingPr: state.reducerMain.loading,
    main: state.reducerMain.process,
    doneP: state.reducerMain.done_process
  }
};

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(mainActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)