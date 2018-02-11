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
import {NEXT_STEP} from "../../Store/constant";


class NewProcessComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clients: this.props.clients,
      partners: this.props.partners,
      loading: false,
      finished: false,
      stepIndex: 0,
      nextButton: true,
    }
  }

  dummyAsync = (cb) => {
    this.setState({loading: true}, () => {
      this.asyncTimer = setTimeout(cb, 500);
    });
  };
  handleNext = () => {
    const {stepIndex} = this.state;
    if (!this.state.loading) {
      this.dummyAsync(() => this.setState({
        loading: false,
        stepIndex: stepIndex + 1,
        finished: stepIndex >= 2,
      }));
    }
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
            <CreateNewClient key = {100} buttonAdd ={true} />,
            <ClientComponent key = {101} users={this.state.clients} check ={true}/>
          ]

        );
      case 1:
        return (
          <div>
            <TextField  floatingLabelText="Ad group name" />
            <p>
              Ad group status is different than the statuses for campaigns, ads, and keywords, though the
              statuses can affect each other. Ad groups are contained within a campaign, and each campaign can
              have one or more ad groups. Within each ad group are ads, keywords, and bids.
            </p>
            <p>Something something whatever cool</p>
          </div>
        );
      case 2:
        return (
          <p>
            Try out different ad text to see what brings in the most customers, and learn how to
            enhance your ads using features like ad extensions. If you run into any problems with your
            ads, find out how to tell if they're running and how to resolve approval issues.
          </p>
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
            disabled={!!!this.props.client }
            onClick={this.handleNext}
          />
        </div>
      </div>
    );
  }
  render() {
    const a = this.props.clients;
    console.log("CLIENT",a.client);
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
    clients: state.reducerClients.clients
  }
};
export default connect(mapStateToProps)(NewProcessComponent)