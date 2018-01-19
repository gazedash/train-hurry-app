// @flow
// @ts-check
import { combineEpics } from "redux-observable";
import actions from "./actions";

// const pingEpic = action$ =>
// action$.ofType(actions.PING)
//   .delay(1000) // Asynchronously wait 1000ms then continue
//   .mapTo({ type: 'PONG' });

// const fetchUserEpic = action$ =>
// action$.ofType(actions.FETCH_USER)
//   .mergeMap(action =>
//     // ajax.getJSON(`https://api.github.com/users/${action.payload}`)
//     //   .map(response => fetchUserFulfilled(response))
//     {}
//   );

import { ofType } from "redux-observable-adapter-xstream";
import delay from "xstream/extra/delay";
import xs, { Stream } from "xstream";
import concat from "xstream/extra/concat";
import { create } from "domain";
import {
  createTimesFromArrival,
  getDiff,
  minsToMs,
  createFinalTimesFromArrival
} from "../utils/index";

export const testFirstEpic = action$ =>
  action$
    .filter(ofType("START"))
    .take(1)
    // .fold((acc, _) => acc + 1, 0)
    // .do(a => console.log(a))
    .map(action => ({ type: "END" }));

const actionTimesSelector = action => {
  console.log(action);
  return [action.payload.ETA, action.payload.now];
};
const getTimes = action =>
  createFinalTimesFromArrival(...actionTimesSelector(action));
const delayReminderAction$ = (actions, i) =>
  // xs.of(action).compose(delay(minsToMs(i > 0 ? 15 : getTimes(action)[0])));
  concat(xs.of(actions[0]), xs.of(actions[1]).compose(delay(1000))).compose(
    delay(500 * (i > 0 ? 15 : getTimes(actions[1])[0]))
  );
const extractMapTimes = action => {
  const times = getTimes(action);
  return times.length !== 1 ? times.slice(1) : times;
};
const remindersStream$ = actions =>
  actions.map((actions, i) => delayReminderAction$(actions, i));
const createReminderActions = action =>
  extractMapTimes(action).map(timeLeft => [
    actions.cleanReminder({ ...action.payload, timeLeft }),
    actions.reminder({ ...action.payload, timeLeft })
  ]);
const isTrainComingOrGone = action =>
  getDiff(...actionTimesSelector(action)) >= 0;
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
    .map(arrConcat)
    .flatten()
    // dispatch reminders only if they are enabled
    .filter(isEnabledReminders(store));

// const geTtimes, dur =>  [...Array(times).keys()].map(a => dur)

// const delayReminder$ = action =>
//   xs.of(action).compose(delay(minsToMs(action.payload.timeLeft)));
// const mapTimes = action =>
//   action.payload.pattern.map(timeLeft =>
//     actions.reminder({ ...action.payload, timeLeft })
//   );
// export const pomodoroEpic = (action$ /*: * */) => {
//   return action$
//     .filter(ofType(actions.trainIncoming().type))
//     .map(mapTimes)
//     .map(delayReminder$)
//     .map(actions => concat(...actions))
//     .flatten();
// };

// .takeUntil(action$.ofType(FETCH_USER_CANCELLED))
// .do(r => console.log(r))

const rootEpic = combineEpics(
  // reminders,
  reminderEpic
  //   pingEpic,
  //   fetchUserEpic
);

export default rootEpic;
