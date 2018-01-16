import configureMockStore from "redux-mock-store";
import { createEpicMiddleware } from "redux-observable";
import { trainIncoming, reminder } from "../actions";
import { reminderEpic, testFirstEpic } from "../epics";

import lolex from "lolex";

import xstreamAdapter from "redux-observable-adapter-xstream";
import {
  createTimesFromArrival,
  getDiff,
  createFinalTimesFromArrival
} from "../../utils/index";

// we have an action describing train arrival
const minsToMs = min => min * 60 * 1000;
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
    const reminderActions = times.map(timeLeft =>
      reminder({ ...payload, timeLeft })
    );
    return { trainIncomingAction, reminderActions, times };
  }

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
    ETA.setHours(ETA.getHours() + 1);
    ETA.setMinutes(1);
    const { trainIncomingAction, reminderActions, times } = makeActions(
      ETA,
      new Date()
    );

    const res = [trainIncomingAction, reminderActions[0]];

    store.dispatch(trainIncomingAction);

    expect(store.getActions()).not.toEqual([]);

    clock.tick(minsToMs(1));

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

  it("testing custom date", done => {
    const ETA = new Date();
    ETA.setHours(ETA.getHours() + 1);
    ETA.setMinutes(30);
    const { trainIncomingAction, reminderActions, times } = makeActions(
      ETA,
      new Date()
    );

    const res = [trainIncomingAction, reminderActions[0]];

    store.dispatch(trainIncomingAction);

    expect(store.getActions()).not.toEqual([]);

    clock.tick(minsToMs(30));

    expect(store.getActions()).not.toEqual([trainIncomingAction]);
    expect(store.getActions()).toEqual(res);
    res.push(reminderActions[1]);

    clock.tick(minsToMs(15));

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

    const res = [trainIncomingAction, reminderActions[0]];

    store.dispatch(trainIncomingAction);

    expect(store.getActions()).not.toEqual([]);

    // clock.tick(minsToMs(30));
    clock.tick(1);

    // expect(store.getActions()).not.toEqual([trainIncomingAction]);
    expect(store.getActions()).toEqual(res);
    res.push(reminderActions[1]);

    clock.tick(minsToMs(15));

    expect(store.getActions()).toEqual(res);

    expect(store.getActions()).not.toEqual([trainIncoming, reminderActions[0]]);

    clock.tick(minsToMs(15));
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

      clock.tick(minsToMs(hour * 60 + minute));
      expect(store.getActions()).toEqual([
        trainIncomingAction,
        ...reminderActions
      ]);
      store.clearActions();
    });
    done();
  });
});
