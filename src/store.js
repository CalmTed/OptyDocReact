import { createStore,combineReducers } from "redux";
import templateReducer from "./reducers/templateReducer";
import appReducer from "./reducers/appReducer";
import copyReducer from "./reducers/copyReducer";

const rootReducer = combineReducers({
  template: templateReducer,
  app: appReducer,
  copies: copyReducer
});

const store = createStore(rootReducer)
store.subscribe(() => {
  window.localStorage.setItem('ODStore',JSON.stringify(store.getState()))
})

export default store;