import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {TextField} from 'material-ui';
import axios from 'axios';

/**
 * Dialog with action buttons. The actions are passed in as an array of React objects,
 * in this example [FlatButtons](/#/components/flat-button).
 *
 * You can also close this dialog by clicking outside the dialog, or with the 'Esc' key.
 */
export default class CreateNewClient extends React.Component {
  state = {
    open: false,
  };

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleOnSubmitClose() {
    let formData = {};
    Object.keys(this.refs).forEach((key) => formData[key] = this.refs[key].getValue());
    axios.post('/add_client', {clients: formData})
      .then(function (response) {
        let body = response.data['status'];
        console.log('body ===>', body);
      })
      .catch(function (error) {
        console.log(error);
      });
    this.setState({open: false});
  }

  render() {
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
        onClick={this.handleOnSubmitClose.bind(this)}
      />,
    ];

    return (
      <div>
        <RaisedButton label="Add new Client" onClick={this.handleOpen} style={{marginBottom: 10}}/>
        <Dialog
          key={5000}
          title="Add new Clients"
          actions={actions}
          modal={false}
          open={this.state.open}
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
              </div>


            </div>


          }
        />
      </div>
    );
  }
}