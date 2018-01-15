import configureMockStore from "redux-mock-store";
import { createEpicMiddleware } from "redux-observable";
import { trainIncoming, reminder } from "../actions";
import { reminderEpic, testFirstEpic } from "../epics";

import lolex from "lolex";

import xstreamAdapter from "redux-observable-adapter-xstream";

// we have an action describing train arrival

// we need to test that epic is emitting reminders (60, 30, 15, 10, 5 mins to go)
const epicMiddleware = createEpicMiddleware(reminderEpic, {
  adapter: xstreamAdapter
});
const mockStore = configureMockStore([epicMiddleware]);

describe("reminderEpic", () => {
  let store;
  let clock;

  beforeEach(() => {
    clock = lolex.install();
    store = mockStore();
  });

  afterEach(() => {
    clock = clock.uninstall();
    epicMiddleware.replaceEpic(reminderEpic);
  });

  it("incoming train", done => {
    const ETA = new Date();

    ETA.setHours(ETA.getHours() + 2);
    const payload = { id: 123, ETA };
    const trainIncomingAction = trainIncoming(payload);
    const NewETA = new Date();
    NewETA.setHours(NewETA.getHours() + 1);
    const reminderAction = reminder({
      ...payload,
      ETA: NewETA
    });

    const NewETA2 = new Date();
    NewETA2.setMinutes(NewETA2.getMinutes() + 30);
    const reminderAction2 = reminder({
      ...payload,
      ETA: NewETA2
    });

    store.dispatch(trainIncomingAction);

    clock.setTimeout(() => {
      expect(store.getActions()).toEqual([trainIncomingAction, reminderAction]);
    }, 60 * 60 * 1001);
    clock.runToLast();
    clock.setTimeout(() => {
      expect(store.getActions()).toEqual([trainIncomingAction, reminderAction, reminderAction2]);
      done();
    }, 1.5 * 60 * 60 * 1001);
    clock.runToLast();
  });

  it("testing take", done => {
    store.dispatch({ type: "SET_STATION" });
    // button.click id => dipsatch SET_STATION
    // reducer(current = id)

    // ofType SET_STATION
    // (obs, time) => obs.filter (diff = ETA - Date >= time)
    // delay(diff)
    // didn't id change?
    // filter (id === current)
    // map({ reminder })
    // takeUntil(action$ ofType 'NOTIFICATION_DISABLED' && action$.id === state.current.id)

    // clock.setTimeout(() => {
    //   console.log(store.getActions());

    //   done();
    // }, 60 * 60 * 1001);
    // clock.runToLast();
    expect(store.getActions()).toEqual([{ type: "START" }, { type: "END" }, { type: "START" }]);
    
    done();
  });
});
