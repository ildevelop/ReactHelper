import React from 'react'
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import ExpandTransition from 'material-ui/internal/ExpandTransition';
import TextField from 'material-ui/TextField';
import './NewProcessComponent.scss'
import ClientComponent from './../ClientComponent/ClientComponent'
import CreateNewClient from "./CreateNewClient";
import {connect} from 'react-redux'
import {NEXT_STEP, SET_NEW_PROCESS, SET_PROBLEM} from "../../Store/constant";
import PartnerComponent from "../PartnerComponent/PartnerComponent";
import axios from 'axios';
import {MenuItem, SelectField} from "material-ui";

class NewProcessComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clients: this.props.clients,
      partners: this.props.partners,
      client: this.props.client,
      loading: false,
      finished: false,
      stepIndex: 0,
      nextButton: true,
      problem: null,
      popUpLabel: 'Add new Client',
      value: 1,
    }
  }
  inputField(event) {
    this.setState({problem:event.target.value});
  }
  dummyAsync = (cb) => {
    this.setState({loading: true}, () => {
      this.asyncTimer = setTimeout(cb, 500);
    });
  };
  addZero = (i) => {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  };
  handleNext = () => {
    const {stepIndex} = this.state;
    if(stepIndex ===1){
      this.props.AddProblem(this.state.problem)
    }
    if(stepIndex ===2){
      let messageObj = {};

      let today = new Date();
      let h = this.addZero(today.getHours());
      let m = this.addZero(today.getMinutes());
      let date = today.getFullYear() + '-'
          + (today.getMonth() + 1) + '-'
          + today.getDate() + ' '
          + h + ':'
          + m;
      messageObj['partner'] = this.props.mainP.partner;
      messageObj['client'] = this.props.mainC.client;
      messageObj['problem'] = this.props.mainC.problem;
      messageObj['data'] = date;
      messageObj['address'] = this.props.mainC.address;
      messageObj['zipp'] = this.props.mainC.zipp;
      messageObj['city'] = this.props.mainC.city;
      axios.post('/send_message', {message: messageObj})
        .then(function (response) {
          let body = response.data['status'];
          console.log('body ===>', body);
        })
        .catch(function (error) {
          console.log(error);
        });
      this.props.SetNewProcess(messageObj);
      this.props.AddProblem('')
    }
    if (!this.state.loading) {
      this.dummyAsync(() => this.setState({
        loading: false,
        stepIndex: stepIndex + 1,
        finished: stepIndex >= 2,
      }));
    }
  };
  handleChange = (event, index, value) => {
    return this.setState({value});
  };
  handlePrev = () => {
    const {stepIndex} = this.state;
    if (!this.state.loading) {
      this.dummyAsync(() => this.setState({
        loading: false,
        stepIndex: stepIndex - 1,
      }));
    }
  };
  getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return (
          [
            <CreateNewClient key = {100} buttonAdd ={true} popUpLabel={this.state.popUpLabel}/>,
            <ClientComponent key = {101} users={this.state.clients} check ={true}/>
          ]

        );
      case 1:
        return (
          <div>
            <TextField
              floatingLabelText="Input her the problem"
              hintText="Message Field"
              multiLine={true}
              onChange={this.inputField.bind(this)}
              rows={3}/>
            <div>
              <h4> Please choose category :</h4>
              <SelectField value={this.state.value} onChange={this.handleChange}>
                {this.props.categories.map(e => <MenuItem key={e._id}
                                                          value={e.category}
                                                          label={e.category}
                                                          primaryText={e.category}/>)}
              </SelectField>
            </div>

            <p>
              Describe the problem with this client.: <b>{this.props.client.fname} {this.props.client.sname}</b>
            </p>
            <p>What happened and how to help.</p>
            <p>preferably in more detail,how we can help him</p>
          </div>
        );
      case 2:
        return (
          [
            <PartnerComponent key = {201} part={this.state.partners.filter(user => user.category.search(this.state.value) !== -1)} check ={true}/>
          ]
        );
      default:
        return 'You\'re a long way from home sonny jim!';
    }
  }

  renderContent() {
    const {finished, stepIndex} = this.state;

    if (finished) {
      return (
        <div className="finishProcess">
          <p>
            <a
              href="#"
              onClick={(event) => {
                event.preventDefault();
                this.setState({stepIndex: 0, finished: false});
              }}
            >
              Click here
            </a> to reset the example.
          </p>
        </div>
      );
    }

    return (
      <div className="finishProcess">
        <div>{this.getStepContent(stepIndex)}</div>
        <div className="flatButton">
          <FlatButton
            label="Back"
            disabled={stepIndex === 0}
            onClick={this.handlePrev}
            style={{marginRight: 12}}
          />
          <RaisedButton
            label={stepIndex === 2 ? 'Finish' : 'Next'}
            primary={true}
            disabled={stepIndex === 1? ! this.state.problem :!Object.keys(this.props.client).length }
            onClick={this.handleNext}
          />
        </div>
      </div>
    );
  }
  render() {
    const {loading, stepIndex} = this.state;
    return (
      <div className="mainNewProcess">
        <Stepper activeStep={stepIndex}>
          <Step>
            <StepLabel style={{color:"#fff"}}>Find client or create new</StepLabel>
          </Step>
          <Step>
            <StepLabel style={{color:"#fff"}}>Write problem</StepLabel>
          </Step>
          <Step>
            <StepLabel style={{color:"#fff"}}>Find partners</StepLabel>
          </Step>
        </Stepper>
        <ExpandTransition loading={loading} open={true}>
          {this.renderContent()}
        </ExpandTransition>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    mainP:state.reducerPartners,
    mainC:state.reducerClients,
    clients: state.reducerClients.clients,
    client: state.reducerClients.client,
    person: state.reducerPartners.partner,
    categories: state.reducerMain.categories
  }
};
export default connect(mapStateToProps, dispatch => ({
  AddProblem: (problem) => {
    const asyncGetPartners = () => dispatch => {
      dispatch({type: SET_PROBLEM, payload: problem})
    };
    dispatch(asyncGetPartners());
  },
  SetNewProcess: (process) => {
    const asyncSetNewProcess = () => dispatch => {
      dispatch({type: SET_NEW_PROCESS, payload: process})
    };
    dispatch(asyncSetNewProcess());
  },
}))(NewProcessComponent)