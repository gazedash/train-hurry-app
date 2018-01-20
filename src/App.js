// @flow
import React, { Component } from "react";
import actions from "./store/actions";
import { connect } from "react-redux";
import "./App.css";
import { createSocketStreamAndSubscribe } from "./ws";
import { AppTitle } from "./components/StyledComponents";
import {
  AddressForm,
  TrainList,
  Reminder,
  BottomReminderToggle
} from "./components/Components";
import { pathOr } from "ramda";

const makeAction = () => {
  const ETA = new Date();
  ETA.setMinutes(ETA.getMinutes() + 31);
  return actions.trainIncoming({ ETA, now: new Date() });
};

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
    trains: []
  };
  state = {
    selected: 0
  };
  componentDidMount() {
    const { makeAction, initWS } = this.props;
    initWS({ next: makeAction });
  }
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
          clean={this.props.cleanReminder}
          disable={this.toggleReminders}
        />
        <BottomReminderToggle
          onClick={this.toggleReminders}
          state={pathOr(null, ['settings', 'reminders', 'state'], this.props)}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { reminder, settings, trains } = state;
  return { reminder, settings, trains };
}
const mapDispatchToProps = {
  makeReminder: actions.reminder,
  makeAction,
  cleanReminder: actions.cleanReminder,
  toggleReminders: actions.toggleReminders
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
