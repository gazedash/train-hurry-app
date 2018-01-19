// @flow
import React, { Component } from "react";
import actions, { cleanReminder, disableReminders } from "./store/actions";
import { connect } from "react-redux";
import {
  AddressForm as AddressForm_,
  Alert,
  Input,
  TrainItem,
  TrainList as TrainList_,
  Button,
  Label,
  AppTitle,
  FormLabel,
  H5,
  Trans
} from "./components/StyledComponents";
import "./App.css";

const makeAction = () => {
  const ETA = new Date();
  ETA.setMinutes(ETA.getMinutes() + 31);
  return actions.trainIncoming({ ETA, now: new Date() });
};

const AddressForm = () => (
  <AddressForm_>
    <Label>
      <FormLabel>From</FormLabel>
      <Input />
    </Label>

    <Label>
      <FormLabel>To</FormLabel>
      <Input />
    </Label>
  </AddressForm_>
);

const Reminder = ({ time, clean = () => {}, disable = () => {} }) => (
  <Alert shouldDisplay={!!time}>
    <div>
      <H5>ALERT</H5>
      {time} minutes to go
    </div>
    <div>
    <Button onClick={clean}>X</Button>
    <Button onClick={disable}>disable</Button>
    </div>
  </Alert>
);

const TrainList = ({ items = [], selected = 0, onClick = () => {} }) => (
  <TrainList_>
    {trains.map((item, i) => (
      <TrainItem
        onClick={() => onClick(i)}
        key={item}
        selected={selected === i}
      >
        {item}
      </TrainItem>
    ))}
  </TrainList_>
);

const trains = ["Baker st. 15:00", "Vasilevskaya st. 20:00"];

export class App extends Component {
  static defaultProps = {
    dispatch: () => {},
    makeAction: () => {},
    cleanReminder: () => {},
    disableReminders: () => {},
    makeReminder: () => {},
    reminder: {
      // ETA: "2018-01-16T13:49:20.691Z",
      // now: "2018-01-16T13:33:20.691Z",
      timeLeft: null
    },
    trains
  };
  state = {
    selected: 0
  };
  componentDidMount() {
    const { makeAction, makeReminder, cleanReminder } = this.props;
    makeReminder();
    makeAction();
    setTimeout(() => {
      // cleanReminder();
    }, 2000);
  }
  cleanReminder = () => {
    const { makeAction, cleanReminder } = this.props;
    cleanReminder();
    setTimeout(() => {
      makeAction();
    }, 500);
  };
  disableReminders = () => {
    const { cleanReminder, disableReminders } = this.props;
    disableReminders();
    cleanReminder();
  };
  render() {
    return (
      <div className="App">
        <AppTitle>HurryApp</AppTitle>
        <AddressForm />
        <TrainList
          items={this.props.trains}
          selected={this.state.selected}
          onClick={selected => this.setState({ selected })}
        />
        <Reminder
          time={this.props.reminder.timeLeft}
          clean={this.cleanReminder}
          disable={this.disableReminders}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { reminder } = state;
  return { reminder };
}
const mapDispatchToProps = {
  makeReminder: actions.reminder,
  makeAction,
  cleanReminder: actions.cleanReminder,
  disableReminders: actions.disableReminders
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
