// @flow
import React, { Component } from "react";
import actions from "./store/actions";
import { connect } from "react-redux";
import "./App.css";

const makeAction = () => {
  const ETA = new Date();
  ETA.setMinutes(ETA.getMinutes() + 31);
  return actions.trainIncoming({ ETA, now: new Date() });
};

export class App extends Component {
  static defaultProps = {
    dispatch: () => {},
    reminder: {
      // ETA: "2018-01-16T13:49:20.691Z",
      // now: "2018-01-16T13:33:20.691Z",
      timeLeft: null
    }
  };
  componentDidMount() {
    this.props.dispatch(makeAction());
  }
  cleanReminder = () => {
    this.props.dispatch(actions.cleanReminder());
    setTimeout(() => {
      this.props.dispatch(makeAction());
    }, 500);
  };
  render() {
    return (
      <div className="App">
        <form>
          <label>
            From
            <input />
          </label>
          <div>.</div>
          <label>
            To
            <input />
          </label>
        </form>
        <ul>
          <li>* Baker st. 15:00</li>
          <li>Vasilevskaya st. 20:00</li>
        </ul>
        {(time =>
          time && (
            <div>
              ALERT {time} minutes to go<button onClick={this.cleanReminder}>
                X
              </button>
            </div>
          ))(this.props.reminder.timeLeft)}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { reminder } = state;
  return { reminder };
}
export default connect(mapStateToProps)(App);
