// @flow
import { combineReducers } from "redux";
// import { uniqWith } from "ramda";
import actions from "./actions";

// const isEqual = (v1, v2) => v1.id === v2.id;
// const uniq = uniqWith(isEqual);

const reminder = (state = {}, action) => {
  switch (action.type) {
    case actions.reminder().type:
      // on card click, set current userId
      return action.payload || {};
    case actions.cleanReminder().type:
      return {};
    default:
      console.log(action);
      
      return state;
  }
};

export default combineReducers({ reminder });
