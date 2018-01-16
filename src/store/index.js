// @flow
import { createStore, applyMiddleware } from "redux";
import xstreamAdapter from "redux-observable-adapter-xstream";
import { createEpicMiddleware } from "redux-observable";
import reducer from "./reducers";
import epic from "./epics";

const epicMiddleware = createEpicMiddleware(epic, { adapter: xstreamAdapter });
const middlewares = [epicMiddleware];

if (process.env.NODE_ENV === `development`) {
  const { logger } = require(`redux-logger`);

  middlewares.push(logger);
}

const store = createStore(reducer, applyMiddleware(...middlewares));
export default store;
