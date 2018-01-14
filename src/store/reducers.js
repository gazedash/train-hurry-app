// @flow
import { combineReducers } from "redux";
// import { uniqWith } from "ramda";
import actions from "./actions";

// const isEqual = (v1, v2) => v1.id === v2.id;
// const uniq = uniqWith(isEqual);

const users = (state = [], action) => {
  switch (action.type) {
    case actions.reminder().type:
    console.log(action);
    
    //   return uniq([...state, ...action.payload]);
    default:
      return state;
  }
};
const albums = (state = [], action) => {
  switch (action.type) {
    case actions.reminder().type:
    //   return uniq([...state, ...action.payload.albums]);
    default:
      return state;
  }
};
const photos = (state = [], action) => {
  switch (action.type) {
    case actions.reminder().type:
    //   return uniq([...state, ...action.payload.photos]);
    default:
      return state;
  }
};

const current = (state = {}, action) => {
  switch (action.type) {
    case actions.reminder().type:
      // on card click, set current userId
      return { userId: action.payload.userId };
    default:
      return state;
  }
};

export default combineReducers({ users, albums, photos, current });