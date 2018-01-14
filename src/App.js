// @flow
import React, { Component } from 'react';
import actions from "./store/actions"
import { connect } from "react-redux";
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    console.log(this.props);
    this.props.dispatch(actions.trainIncoming({ ETA: new Date() }))
    
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default connect()(App);
