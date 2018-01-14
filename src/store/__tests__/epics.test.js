import configureMockStore from "redux-mock-store";
import { createEpicMiddleware } from "redux-observable";
import { trainIncoming, reminder } from "../actions";
import { reminderEpic } from "../epics";

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

    store.dispatch(trainIncomingAction);

    clock.setTimeout(() => {
      expect(store.getActions()).toEqual([trainIncomingAction, reminderAction]);
      done();
    }, 60 * 60 * 1001);
    clock.runToLast();
  });
});
