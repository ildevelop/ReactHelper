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
import {Link} from 'react-router-dom';
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

class MainMenu extends React.Component {
  constructor() {
    super();
    this.state = {
      isClients: false,
      isPartners: false,
      isInProcess: false,
      isDone:false,
      isNewIntervention: false
    }
  }
  onClickMenu(qw){
    if(qw == "Clients"){
      console.log(qw);
      this.setState({
        isClients: true,
        isPartners: false,
        isInProcess: false,
        isDone:false,
        isNewIntervention: false
      })
    }
    if(qw == "Partners"){
      console.log(qw);
      this.setState({
        isClients: false,
        isPartners: true,
        isInProcess: false,
        isDone:false,
        isNewIntervention: false
      })
    }
    if(qw == "InProcess"){
      console.log(qw);

      this.setState({
        isClients: false,
        isPartners: false,
        isInProcess: true,
        isDone:false,
        isNewIntervention: false
      })
    }
    if(qw == "Done"){
      console.log(qw);

      this.setState({
        isClients: false,
        isPartners: false,
        isInProcess: false,
        isDone:true,
        isNewIntervention: false
      })
    }
    if(qw == "NewIntervention"){
      console.log(qw);

      this.setState({
        isClients: false,
        isPartners: false,
        isInProcess: false,
        isDone:false,
        isNewIntervention: true
      })
    }
  }

  render() {
    return (
      <div>
        <Paper style={style.paper}>
          <Menu>
            <MenuItem primaryText="Clients"  rightIcon={<Assistant/>} onClick={this.onClickMenu.bind(this,"Clients")}></MenuItem>
            <Divider />
            <MenuItem primaryText="Partners" rightIcon={<Partners/>} onClick={this.onClickMenu.bind(this,"Partners")} ></MenuItem>
            <Divider />
            {/*<MenuItem primaryText="In Process" to="/in_process" rightIcon={<Process/>} onClick={this.onClickMenu.bind(this,"InProcess")}/>*/}
            <Divider />
            {/*<MenuItem primaryText="Done" to="/done" rightIcon={<Done/>} onClick={this.onClickMenu.bind(this,"Done")}/>*/}
            <Divider />
            {/*<MenuItem primaryText="New Intervention" to="/new_intervention" rightIcon={<Add />} onClick={this.onClickMenu.bind(this,"NewIntervention")}/>*/}
          </Menu>
        </Paper>
      </div>
    )
  }
}

export default MainMenu