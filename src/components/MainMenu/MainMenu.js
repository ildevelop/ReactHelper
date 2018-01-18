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

const style = {
  paper: {
    display: 'inline-block',
    float: 'left',
    margin: '16px 32px 16px 0',
  },
  rightIcon: {
    textAlign: 'center',
    lineHeight: '24px',
  },
};
export class MainMenu extends React.Component {
  constructor() {
    super()
  }

  render() {
    return (
      <div>
        <Paper style={style.paper}>
          <Menu>
            <MenuItem primaryText="Clients" rightIcon={<Assistant/>} />
            <Divider />
            <MenuItem primaryText="Partners" rightIcon={<Partners/>} />
            <Divider />
            <MenuItem primaryText="In Process" rightIcon={<Process/>} />
            <Divider />
            <MenuItem primaryText="Done" rightIcon={<Done/>} />
            <Divider />
            <MenuItem primaryText="New Intervention" rightIcon={<Add />} />
          </Menu>
        </Paper>
      </div>
    )
  }
}

export default MainMenu