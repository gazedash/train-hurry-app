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
import flattenConcurrently from "xstream/extra/flattenConcurrently";
import { create } from "domain";

export const testFirstEpic = action$ =>
  action$
    .filter(ofType("START"))
    .take(1)
    // .fold((acc, _) => acc + 1, 0)
    // .do(a => console.log(a))
    .map(action => ({ type: "END" }));

/**
 * @param {Stream} action$
 */
export const reminderEpic = (action$ /*: * */) => {
  const hour = 60;
  const minsToMs = min => min * 60 * 1000;
  const createReminder = ({ payload }, timeLeft) =>
    actions.reminder({ ...payload, timeLeft });
  const firstTime = hour;
  const secondTime = hour - (hour / 4);
  const thirdTime = hour / 2;
  const fourthTime = hour / 4;
  const times = [firstTime, secondTime, thirdTime, fourthTime];
  const mapTimes = action => times.map(time => createReminder(action, time));
  const delayReminderAction = action =>
    xs
      .of(action)
      .compose(
        delay(
          minsToMs(
            action.payload.timeLeft < 60
              ? 15
              : 60
          )
        )
      );
  const remindersStream = actions => actions.map(delayReminderAction);

  return action$
    .filter(ofType(actions.trainIncoming().type))
    .map(action => mapTimes(action))
    .map(actionS => concat(...remindersStream(actionS)))
    .flatten();
};

// .takeUntil(action$.ofType(FETCH_USER_CANCELLED))
// .do(r => console.log(r))

const rootEpic = combineEpics(
  reminderEpic
  //   pingEpic,
  //   fetchUserEpic
);

export default rootEpic;
