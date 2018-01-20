// @flow
import React, { Component } from "react";
import actions from "./store/actions";
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
  RoundedElipsis,
  Toggle,
  Flex,
  MarginAuto
} from "./components/StyledComponents";
import "./App.css";
import { createSocketStreamAndSubscribe } from "./ws";

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

const TrainList = ({ items = [], selected = 0, onClick = a => {} }) => (
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

const ReminderToggle = ({ state, onClick = () => {} }) => (
  <RoundedElipsis onClick={onClick} disabled={state !== "enabled"}>
    <Toggle />
  </RoundedElipsis>
);

const trains = ["Baker st. 15:00", "Vostochnaya st. 03:30", "Vasilevskaya st. 20:00", "Mayakovskaya st. 19:00", "Shilo st. 21:00", "Aleksandrovskaya st. 22:00", "Krasnaya ploshad st. 05:00", "Gruzinskaya st. 12:00", "Baker st. 15:00", "Vostochnaya st. 03:30", "Vasilevskaya st. 20:00", "Mayakovskaya st. 19:00", "Shilo st. 21:00", "Aleksandrovskaya st. 22:00", "Krasnaya ploshad st. 05:00", "Gruzinskaya st. 12:00"];

/*:: type State = { selected: number }; */
export class App extends Component /*:: <*, State> */ {
  static defaultProps = {
    dispatch: () => {},
    makeAction: () => {},
    cleanReminder: () => {},
    toggleReminders: () => {},
    makeReminder: () => {},
    initWS: createSocketStreamAndSubscribe,
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
    const { makeAction, makeReminder, cleanReminder, initWS } = this.props;
    // makeReminder();
    makeAction();
    // initWS({ next: makeAction })
    setTimeout(() => {
      // cleanReminder();
    }, 2000);
  }
  cleanReminder = () => {
    const { makeAction, cleanReminder } = this.props;
    cleanReminder();
    setTimeout(() => {
      // makeAction();
    }, 500);
  };
  toggleReminders = () => {
    const { cleanReminder, toggleReminders } = this.props;
    if (this.props.settings.reminders.state === "enabled") {
      cleanReminder();
    }
    toggleReminders();
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
          disable={this.toggleReminders}
        />
        <MarginAuto>
          <Flex>
            <FormLabel noBg={true}>Reminders</FormLabel>{" "}
            <ReminderToggle
              onClick={this.toggleReminders}
              state={this.props.settings.reminders.state}
            />
          </Flex>
        </MarginAuto>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { reminder, settings } = state;
  return { reminder, settings };
}
const mapDispatchToProps = {
  makeReminder: actions.reminder,
  makeAction,
  cleanReminder: actions.cleanReminder,
  toggleReminders: actions.toggleReminders
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
