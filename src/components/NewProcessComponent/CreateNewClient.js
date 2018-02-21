import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {MenuItem, SelectField, TextField} from 'material-ui';
import {connect} from 'react-redux'
import {HANDLE_DIALOG, SET_ONE_CLIENTS, SET_ONE_PARTNER} from "../../Store/constant";
import {bindActionCreators} from 'redux';
import * as mainActions from '../../Actions/MainActions';

class CreateNewClient extends React.Component {
  state = {
    value: 1,
  };

  handleOnSubmitClose() {
    let formData = {};
    Object.keys(this.refs).forEach((key) => formData[key] = this.refs[key].getValue());
    console.log('popUpLabel',this.props.popUpLabel);
    if (this.props.popUpLabel === "Add new Client") {
      this.props.addClient(formData);
      this.props.handleDialog(false);
    }
    else {
      formData["category"] = this.state.value;
      this.props.addPartner(formData);
      this.props.handleDialog(false);
    }
  }

  handleChange = (event, index, value) => {
    return this.setState({value});
  };

  handleClose = () => {
    this.props.handleDialog(false);
  };

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
        {this.props.buttonAdd ? <RaisedButton label="Add new Client"
                                              onClick={() => {
                                                this.props.handleDialog(true)
                                              }}
                                              style={{marginBottom: 10}}/> : <div/>}

        <Dialog
          title={this.props.popUpLabel}
          actions={actions}
          modal={false}
          open={this.props.main.openIntervention}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
        >
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
              {this.props.popUpLabel === 'Add new partners' ? <div style={{textAlign: "end"}}>
                <b style={{
                  position: "relative", left: 135, top: 15
                }}>Categories:</b></div> : <div/>}
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
              {this.props.popUpLabel === 'Add new partners' ?
                <div>
                  <TextField hintText="30%" ref="commission" floatingLabelText="Commission"/><br/>
                  <SelectField value={this.state.value} onChange={this.handleChange}>
                    {this.props.main.categories.map(e => <MenuItem key={e._id}
                                                                   value={e.category}
                                                                   label={e.category}
                                                                   primaryText={e.category}/>)}
                  </SelectField>
                </div>
                : <br/>}
            </div>
          </div>
        </Dialog>
      </div>
    );
  }
}

// add categories to db  db.categories.insert({ category : "plumper"})
const mapStateToProps = (state) => {
  return {
    main: state.reducerMain
  }
};

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(mainActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateNewClient)