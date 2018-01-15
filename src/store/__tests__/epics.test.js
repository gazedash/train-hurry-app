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
    const getReminder = timeLeft => reminder({ ...payload, timeLeft });
    const minsToMs = min => min * 60 * 1000;
    const times = [60, 45, 30, 15];
    const reminderActions = times.map(time => getReminder(time));

    const res = [trainIncomingAction, reminderActions[0]];

    store.dispatch(trainIncomingAction);

    expect(store.getActions()).not.toEqual([]);

    clock.tick(minsToMs(60));

    expect(store.getActions()).not.toEqual([trainIncomingAction]);
    expect(store.getActions()).toEqual(res);
    res.push(reminderActions[1]);

    clock.tick(minsToMs(15));

    expect(store.getActions()).toEqual(res);

    expect(store.getActions()).not.toEqual([trainIncoming, reminderActions[0]]);

    clock.tick(minsToMs(15));

    res.push(reminderActions[2]);
    expect(store.getActions()).toEqual(res);

    clock.tick(minsToMs(15));

    res.push(reminderActions[3]);
    expect(store.getActions()).toEqual(res);
    done();
  });

  it("testing take", done => {
    store.dispatch({ type: "SET_STATION" });

    expect(store.getActions()).toEqual([
      { type: "START" },
      { type: "END" },
      { type: "START" }
    ]);

    done();
  });
});
