import { createStore,combineReducers } from "redux";
import templateReducer from "./reducers/templateReducer"
import appReducer from "./reducers/appReducer"

const rootReducer = combineReducers({
  template: templateReducer,
  app: appReducer
});

const store = createStore(rootReducer)
store.subscribe(() => {
  window.localStorage.setItem('ODStore',JSON.stringify(store.getState()))
}) 

export default store;