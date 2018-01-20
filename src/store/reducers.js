// @flow
import { combineReducers } from "redux";
import actions from "./actions";
import { assocPath, path, nth } from "ramda";

const initialState = {
  reminders: {
    states: ["enabled", "disabled"],
    state: "enabled"
  }
};
function toggleReminders(reducerState) {
  const { states, state } = path(["reminders"], reducerState);
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
      return { ...state, ...action.payload };
    case actions.cleanReminder().type:
      return {};
    default:
      return state;
  }
};

const initialTrainState = [
  "Baker st. 15:00",
  "Vostochnaya st. 03:30",
  "Vasilevskaya st. 20:00",
  "Mayakovskaya st. 19:00",
  "Shilo st. 21:00",
  "Aleksandrovskaya st. 22:00",
  "Krasnaya ploshad st. 05:00",
  "Gruzinskaya st. 12:00",
  "Brodskaya st. 15:00",
  "Vishnevskaya st. 03:30",
  "Miller st. 20:00",
  "Perry st. 19:00",
  "Imperatorskaya st. 21:00",
  "Proletarskaya st. 22:00",
  "Red square st. 05:00",
  "Prague st. 12:00"
];
const trains = (state = initialTrainState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default combineReducers({ reminder, settings, trains });
