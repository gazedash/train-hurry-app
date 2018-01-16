// @flow
import { createAction } from "redux-actions";
// import api from "../../api";

export const trainIncoming = createAction("TRAIN_INCOMING");
export const reminder = createAction("REMINDER");
export const cleanReminder = createAction("CLEAN_REMINDER");

const actions = {
  trainIncoming,
  reminder,
  cleanReminder
}
export default actions;