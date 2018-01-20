import configureMockStore from "redux-mock-store";
import { createEpicMiddleware } from "redux-observable";
import { trainIncoming, reminder, cleanReminder } from "../actions";
import { reminderEpic } from "../epics";

import lolex from "lolex";

import xstreamAdapter from "redux-observable-adapter-xstream";
import {
  createTimesFromArrival,
  getDiff,
  createFinalTimesFromArrival
} from "../../utils/index";
import reducers from "../reducers";
import * as R from "ramda";

// we have an action describing train arrival
const minsToMs = min => min * 60 * 1000;
const dt = 15 * 500 + 1001;
// we need to test that epic is emitting reminders (60, 30, 15, 10, 5 mins to go)
const epicMiddleware = createEpicMiddleware(reminderEpic, {
  adapter: xstreamAdapter
});
const mockStore = configureMockStore([epicMiddleware]);

describe("reminderEpic", () => {
  let store;
  let clock;

  function makeActions(ETA, now) {
    const payload = { id: 123, ETA, now };
    const trainIncomingAction = trainIncoming(payload);
    const diff = getDiff(ETA, now);
    const times = [...createTimesFromArrival(diff)];
    if (diff && times.length === 0) {
      times.push(diff);
    }
    // const times = [60, 45, 30, 15];
    const reminderActions = times.map(timeLeft => [
      cleanReminder({ ...payload, timeLeft }),
      reminder({ ...payload, timeLeft })
    ]);
    return { trainIncomingAction, reminderActions, times };
  }

  beforeEach(() => {
    clock = lolex.install();
    store = mockStore(reducers({}, { type: "B" }));
    // store.replaceReducer(reducers)
  });

  afterEach(() => {
    clock = clock.uninstall();
    epicMiddleware.replaceEpic(reminderEpic);
  });

  it("incoming train", done => {
    const ETA = new Date();
    ETA.setHours(ETA.getHours() + 1);
    ETA.setMinutes(1);
    const {
      trainIncomingAction,
      reminderActions,
      times
    } = makeActions(ETA, new Date());

    const res = [trainIncomingAction, ...reminderActions[0]];

    store.dispatch(trainIncomingAction);

    expect(store.getActions()).not.toEqual([]);

    clock.tick(dt);

    expect(store.getActions()).not.toEqual([trainIncomingAction]);
    expect(store.getActions()).toEqual(res);
    res.push(...reminderActions[1]);

    clock.tick(dt);

    expect(store.getActions()).toEqual(res);

    expect(store.getActions()).not.toEqual([trainIncoming, reminderActions[0]]);

    clock.tick(dt);

    res.push(...reminderActions[2]);
    expect(store.getActions()).toEqual(res);

    clock.tick(dt);

    res.push(...reminderActions[3]);
    expect(store.getActions()).toEqual(res);
    done();
  });

  it("testing custom date", done => {
    const ETA = new Date();
    ETA.setHours(ETA.getHours() + 1);
    ETA.setMinutes(30);
    const { trainIncomingAction, reminderActions, times } = makeActions(
      ETA,
      new Date()
    );

    const res = [trainIncomingAction, ...reminderActions[0]];

    store.dispatch(trainIncomingAction);

    expect(store.getActions()).not.toEqual([]);

    clock.tick(dt * 2);

    expect(store.getActions()).not.toEqual([trainIncomingAction]);
    expect(store.getActions()).toEqual(res);
    res.push(...reminderActions[1]);

    clock.tick(dt);

    expect(store.getActions()).toEqual(res);

    expect(store.getActions()).not.toEqual([trainIncoming, reminderActions[0]]);

    done();
  });

  it("testing custom date", done => {
    const ETA = new Date();
    // ETA.setHours(ETA.getHours() + 1);
    ETA.setMinutes(30);
    const { trainIncomingAction, reminderActions, times } = makeActions(
      ETA,
      new Date()
    );

    const res = [trainIncomingAction, ...reminderActions[0]];

    store.dispatch(trainIncomingAction);

    expect(store.getActions()).not.toEqual([]);

    // clock.tick(minsToMs(30));
    clock.tick(dt / 2);

    // expect(store.getActions()).not.toEqual([trainIncomingAction]);
    expect(store.getActions()).toEqual(res);
    res.push(...reminderActions[1]);

    clock.tick(dt);

    expect(store.getActions()).toEqual(res);

    expect(store.getActions()).not.toEqual([trainIncoming, reminderActions[0]]);

    clock.tick(dt);
    expect(store.getActions()).toEqual(res);

    done();
  });

  it("test final result in map", done => {
    const ETA = new Date();
    // ETA.setHours(ETA.getHours() + 1);
    ETA.setMinutes(30);
    const times = [
      [0, 1],
      [0, 5],
      [0, 15],
      [0, 16],
      [0, 29],
      [0, 30],
      [0, 35],
      [0, 45],
      [0, 47],
      [0, 59],
      [1, 0],
      [1, 1],
      [1, 5],
      [1, 30],
      [2, 0],
      [2, 10]
    ];
    times.map(time => {
      const [hour, minute] = time;
      const ETA = new Date();
      const now = new Date();
      ETA.setHours(hour);
      ETA.setMinutes(minute);
      now.setHours(0);
      now.setMinutes(0);
      const { trainIncomingAction, reminderActions, times } = makeActions(
        ETA,
        now
      );

      store.dispatch(trainIncomingAction);

      expect(store.getActions()).not.toEqual([]);

      clock.tick((15 * 500 + 1000) * hour * 60 + minute * 100000);
      expect(store.getActions()).toEqual([
        trainIncomingAction,
        ...R.flatten(reminderActions)
      ]);
      store.clearActions();
    });
    done();
  });
});
