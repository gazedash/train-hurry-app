// @flow
import { createAction } from "redux-actions";
// import api from "../../api";

export const trainIncoming = createAction("TRAIN_INCOMING");
export const reminder = createAction("REMINDER");
const actions = {
  trainIncoming,
  reminder
}
export default actions;