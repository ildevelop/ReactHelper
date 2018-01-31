import React from 'react'

import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Add from 'material-ui/svg-icons/content/add-circle-outline';


const style = {
  display: 'inline-block',
  margin: '16px 32px 16px 0',
};

class NewIntervention extends React.Component {
  constructor() {
    super();
    this.state = {
      curentState: '',
      isClients: false,
      isPartners: false,
      isProcess: false,

    }
  }

  switcher() {
    switch (this.state.curentState) {
      case "clients":
        return ( <div> hello clients</div>);
      case "partner":
        return (<div> hello partner</div>);
      case "process":
        return (<div> hello process</div>);
    }
  }

  onClickAddNew(qw) {
    this.setState({curentState: qw});
    if (qw == "clients") {
      this.setState({
        isClients: true,
        isPartners: false,
        isProcess: false,
      })
    }
    if (qw == "partner") {
      this.setState({
        isClients: true,
        isPartners: false,
        isProcess: false,
      })
    }
    if (qw == "process") {
      this.setState({
        isClients: true,
        isPartners: false,
        isProcess: false,
      })
    }
  }

  render() {

    return (
      <div>
        <Menu>
          <MenuItem
            primaryText="Add new Client"
            onClick={this.onClickAddNew.bind(this, "clients")}
            rightIcon={<Add hoverColor="#23822e" color="#2cde41"/>}/>
          <MenuItem
            primaryText="Add new Partners"
            onClick={this.onClickAddNew.bind(this, "partner")}
            rightIcon={<Add hoverColor="#23822e" color="#2cde41"/>}/>
          <MenuItem
            primaryText="Add new Process"
            onClick={this.onClickAddNew.bind(this, "process")}
            rightIcon={<Add hoverColor="#23822e" color="#2cde41"/>}/>
        </Menu>
        {this.switcher()}

      </div>
    )
  }
}

export default NewIntervention