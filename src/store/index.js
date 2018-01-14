// @flow
import { createStore, applyMiddleware } from "redux";
import xstreamAdapter from 'redux-observable-adapter-xstream';
import { createEpicMiddleware } from 'redux-observable';
import reducer from "./reducers";
import epic from "./epics";

const epicMiddleware = createEpicMiddleware(epic, { adapter: xstreamAdapter });

const store = createStore(reducer, applyMiddleware(epicMiddleware));
export default store;