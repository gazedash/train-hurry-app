// @flow
// @ts-check
import { combineEpics } from "redux-observable";
import actions from "./actions";

import { ofType } from "redux-observable-adapter-xstream";
import delay from "xstream/extra/delay";
import xs, { Stream } from "xstream";
import concat from "xstream/extra/concat";
import { create } from "domain";
import { getDiff, minsToMs, createFinalTimesFromArrival } from "../utils/index";

const actionTimesSelector = action => {
  return [action.payload.ETA, action.payload.now];
};
const getTimes = action =>
  // generate array of numbers, which later will be mapped to reminder actions
  // [timeLeft,60?,45?,30?,15?]
  createFinalTimesFromArrival(...actionTimesSelector(action));
const delayReminderAction$ = (actions, i) =>
  // xs.of(action).compose(delay(minsToMs(i > 0 ? 15 : getTimes(action)[0])));
  concat(xs.of(actions[0]), xs.of(actions[1]).compose(delay(1000))).compose(
    delay(500 * (i > 0 ? 15 : getTimes(actions[1])[0]))
  );
const extractMapTimes = action => {
  const times = getTimes(action);
  // first time is the time left before first reminder, so no need to create action BEFORE reminders
  return times.length !== 1 ? times.slice(1) : times;
};
const remindersStream$ = actions =>
  actions.map((actions, i) => delayReminderAction$(actions, i));
const createReminderActions = action =>
  extractMapTimes(action).map(timeLeft => [
    // cleanReminder is needed to trigger animation
    actions.cleanReminder({ ...action.payload, timeLeft }),
    actions.reminder({ ...action.payload, timeLeft })
  ]);
const isTrainComingOrGone = action =>
  getDiff(...actionTimesSelector(action)) >= 0;
// helper function so I can do .map(arrConcat) instead of this
const arrConcat = actions => concat(...actions);
const isEnabledRemindersSelector = store =>
  store.getState().settings.reminders.state === "enabled" ? true : false;
const isEnabledReminders = store => () => isEnabledRemindersSelector(store);

/**
 * @param {Stream} action$
 */
export const reminderEpic = (action$ /*: * */, store /*: * */) =>
  action$
    .filter(ofType(actions.trainIncoming().type))
    // in case train already passed, it's tooo laaaate to laaatte
    .filter(isTrainComingOrGone)
    // for every train, few reminders (every 15 mins)
    .map(createReminderActions)
    // wrap actions in observables, delay them
    .map(remindersStream$)
    // concat so they go like this T--X--Y--Z instead of emitting all at once
    // .map().flatten() works like switchMap: discards previous event if new already came
    // e.g. if user double clicks on dispatcher button, delayed events emitted by first click
    // will be discarded
    .map(arrConcat)
    .flatten()
    // dispatch reminders only if they are enabled
    .filter(isEnabledReminders(store));

const rootEpic = combineEpics(reminderEpic);

export default rootEpic;
