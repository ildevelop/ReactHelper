import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {MenuItem, SelectField, TextField} from 'material-ui';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import * as mainActions from '../../Actions/MainActions';

class CreateNewClient extends React.Component {
  state = {
    value: 1,
    fname: '',
    sname: '',
    phone_number: '',
    email: '',
    city: '',
    address: '',
    zipp: '',
    commission: '',
    openErr: false
  };

  handleOnSubmitClose() {
    let formData = {};
    Object.keys(this.refs).forEach((key) => formData[key] = this.refs[key].getValue().toLowerCase());
    console.log('Object formData:',formData);
    if(this.state.fname && this.state.sname && this.state.phone_number && this.state.email && this.state.city && this.state.address && this.state.zipp ) {
      console.log("good");
      if (this.props.popUpLabel === "Add new clients") {
        this.props.addClient(formData);
        this.props.handleDialog(false);
      }
      else {
        formData["category"] = this.state.value;
        formData["work_process_id"] = [];
        this.props.addPartner(formData);
        this.props.handleDialog(false);
      }
    }else {
      this.setState({openErr:true})
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
                         errorText={this.state.fname.length < 1? "This field is required" : ""}
                         onChange={ (event , newValue) => this.setState({fname: newValue}) }
              />
              <br/>
              <TextField hintText="Amar" ref="sname" floatingLabelText="Your surname"
                         errorText={this.state.sname.length < 1? "This field is required" : ""}
                         onChange={ (event , newValue) => this.setState({sname: newValue})}
              />
              <br/>
              <TextField hintText="0549876543" ref="phone_number" floatingLabelText="Phone"
                         errorText={this.state.phone_number.length < 1? "This field is required" : ""}
                         onChange={ (event , newValue) => this.setState({phone_number: newValue})}
              />
              <br/>
              <TextField hintText="bob@gmail.com" ref="email" floatingLabelText="Your E-mail "
                         errorText={this.state.email.length < 1? "This field is required" : ""}
                         onChange={ (event , newValue) => this.setState({email: newValue})}
              />
              <br/>
              {this.props.popUpLabel === 'Add new partners' ? <div style={{textAlign: "end"}}>
                <b style={{
                  position: "relative", left: 135, top: 15
                }}>Categories:</b></div> : <div/>}
            </div>
            <div className="textField2">
              <TextField hintText="Tel Aviv" ref="city" floatingLabelText="City"
                         errorText={this.state.city.length < 1? "This field is required" : ""}
                         onChange={ (event , newValue) => this.setState({city: newValue})}
              />
              <br/>
              <TextField hintText="Jabotinsky 25" ref="address" floatingLabelText="Street"
                         errorText={this.state.address.length < 1? "This field is required" : ""}
                         onChange={ (event , newValue) => this.setState({address: newValue})}
              />
              <br/>
              <TextField hintText="7750505" ref="zipp" floatingLabelText="ZIP"
                         errorText={this.state.zipp.length < 1? "This field is required" : ""}
                         onChange={ (event , newValue) => this.setState({zipp: newValue})}
              />
              <br/>
              {this.props.popUpLabel === 'Add new partners' ?
                <div>
                  <TextField hintText="30%" ref="commission" floatingLabelText="Commission"
                             errorText={this.state.commission.length < 1? "This field is required" : ""}
                             onChange={ (event , newValue) => this.setState({commission: newValue})}/><br/>
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
          {this.state.openErr? <div >  <b style={{
            position: "relative", left: 135, top: 15 ,color: "#E53935"
          }}> Please fill in all the fields!</b></div>: <div/>}
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