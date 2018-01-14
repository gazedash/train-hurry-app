// @flow
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

export const reminderEpic = (action$ /*: * */) =>
  action$
    .filter(ofType(actions.trainIncoming().type))
    .compose(delay(60 * 60 * 1000))
    .map(action => actions.reminder({ ...action.payload, ETA: new Date() }));

const rootEpic = combineEpics(
  reminderEpic
  //   pingEpic,
  //   fetchUserEpic
);

export default rootEpic;
