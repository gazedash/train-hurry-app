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

const actionTimesSelector = action => [action.payload.ETA, action.payload.now];
const getTimes = action =>
  createFinalTimesFromArrival(...actionTimesSelector(action));
const delayReminderAction$ = (action, i) =>
  xs.of(action).compose(delay(minsToMs(i > 0 ? 15 : getTimes(action)[0])));
const extractMapTimes = action => {
  const times = getTimes(action);
  return times.length !== 1 ? times.slice(1) : times;
};
const remindersStream$ = actions => actions.map(delayReminderAction$);
const createReminderActions = action =>
  extractMapTimes(action).map(timeLeft =>
    actions.reminder({ ...action.payload, timeLeft })
  );
const isTrainComingOrGone = action =>
  getDiff(...actionTimesSelector(action)) >= 0;
const arrConcat = actions => concat(...actions);
/**
 * @param {Stream} action$
 */
export const reminderEpic = (action$ /*: * */) =>
  action$
    .filter(ofType(actions.trainIncoming().type))
    // in case train already passed, it's tooo laaaate to laaatte
    .filter(isTrainComingOrGone)
    .map(createReminderActions)
    .map(remindersStream$)
    .map(arrConcat)
    .flatten();

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
  reminderEpic
  //   pingEpic,
  //   fetchUserEpic
);

export default rootEpic;
