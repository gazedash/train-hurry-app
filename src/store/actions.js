// @flow
import { createAction } from "redux-actions";
// import api from "../../api";

export const trainIncoming = createAction("TRAIN_INCOMING");
export const reminder = createAction("REMINDER");
export const cleanReminder = createAction("CLEAN_REMINDER");
export const disableReminders = createAction("DISABLE_REMINDERS");

const actions = {
  trainIncoming,
  reminder,
  cleanReminder,
  disableReminders
}
export default actions;