// @flow
import { combineReducers } from "redux";
// import { uniqWith } from "ramda";
import actions from "./actions";
import { assocPath, path, nth } from "ramda";

// const isEqual = (v1, v2) => v1.id === v2.id;
// const uniq = uniqWith(isEqual);
const initialState = {
  reminders: {
    states: ["enabled", "disabled"],
    state: "enabled"
  }
};
function toggleReminders(reducerState) {
  const { states, state } = path(["reminders"], reducerState);
  console.log(state,nth(0, states.filter(s => s !== state)[0]));
  
  return nth(0, states.filter(s => s !== state));
}
const settings = (state = initialState, action) => {
  switch (action.type) {
    case actions.toggleReminders().type:
      return assocPath(["reminders", "state"], toggleReminders(state), state);
    default:
      return state;
  }
};

const reminder = (state = {}, action) => {
  switch (action.type) {
    case actions.reminder().type:
      // on card click, set current userId
      return { ...state, ...action.payload };
    case actions.cleanReminder().type:
      return {};
    default:
      console.log(action);

      return state;
  }
};

export default combineReducers({ reminder, settings });
