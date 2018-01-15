// @flow
import React, { Component } from "react";
import actions from "./store/actions";
import { connect } from "react-redux";
import "./App.css";

class App extends Component {
  render() {
    console.log(this.props);
    this.props.dispatch(actions.trainIncoming({ ETA: new Date() }));

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
        <div>
          ALERT
          5 minutes to go
        </div>
      </div>
    );
  }
}

export default connect()(App);
