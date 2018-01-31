import React from 'react'
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import DatePicker from 'material-ui/DatePicker';
import {TextField} from "material-ui";


class NewIntervention extends React.Component {
  constructor(){
    super();
    this.handleClose = this.handleClose.bind(this)
  }
  state = {
    open: false,
    position: ''
  };

  handleClose(){
    this.setState({open: false});
  }

  componentWillMount(){
    this.setState({
      open: this.props.open,
      position: this.props.position
    })
  }
  render() {

    console.log('position',this.state.position);
    console.log('opn',this.state.open);
    const actions = [

      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleClose}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onClick={this.handleClose}
      />
    ];

    return (
      <div>

        <Dialog
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          children={<div>
            <h2>
              Add new {this.state.position}:
            </h2>
            <TextField
              hintText="Bob"
              floatingLabelText="Your name"
            /><br />
            <TextField
              hintText="Israel Tel Aviv"
              floatingLabelText="Your Address"
            /><br />
            <TextField
              hintText="bob@gmail.com"
              floatingLabelText="Your E-mail "
            /><br />
          </div>}
        >

        </Dialog>
      </div>
    );
  }
}
export default NewIntervention