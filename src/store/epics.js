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
  const hour = 60 * 60 * 1000;
  const HalfHourReminderDate = new Date();

  const s = action$
    .filter(ofType(actions.trainIncoming().type))
    .map(action => {
      console.log(action);

      HalfHourReminderDate.setHours(action.payload.ETA.getHours() - 2);
      HalfHourReminderDate.setMinutes(30);
      return action;
    })
    .compose(delay(hour));

  return xs
    .merge(
      s,
      xs
        .of({ payload: { final: true, ETA: HalfHourReminderDate } })
        .compose(delay(1.5 * hour))
    )
    .map(action =>
      actions.reminder({
        ...action.payload,
        ETA: action.payload.final ? action.payload.ETA : new Date()
      })
    );
};

// .takeUntil(action$.ofType(FETCH_USER_CANCELLED))
// .do(r => console.log(r))

const rootEpic = combineEpics(
  reminderEpic
  //   pingEpic,
  //   fetchUserEpic
);

export default rootEpic;
