// @flow
import { combineReducers } from "redux";
// import { uniqWith } from "ramda";
import actions from "./actions";

// const isEqual = (v1, v2) => v1.id === v2.id;
// const uniq = uniqWith(isEqual);

const users = (state = [], action) => {
  switch (action.type) {
    case actions.reminder().type:
      console.log(action);

    //   return uniq([...state, ...action.payload]);
    default:
      return state;
  }
};

const reminder = (state = {}, action) => {
  switch (action.type) {
    case actions.reminder().type:
      // on card click, set current userId
      return action.payload;
    case actions.cleanReminder().type:
      return {};
    default:
      return state;
  }
};

export default combineReducers({ users, reminder });
