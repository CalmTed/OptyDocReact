import React from "react";
import actionTypes from "../constants/actionTypes";
import t from "../local.ts";
function Tab ({store, tabValue, tabIndex, tabName}) {
  const stateNow = store.getState();

  const getClasses = (stateNow, tabValue) => {
    let classes = "Tab ";
    if(stateNow.app.tabSelected === tabValue) {
      classes += "active ";
    }
    return classes;
  };
  const handleClick = () => {
    store.dispatch({type:actionTypes.TAB_SET,
      payload: tabValue});
  };
  const handleKeyPress = (e) => {
    e.key === "Enter" ? handleClick() : false;
  };
  return (
    <div className={getClasses(stateNow, tabValue)} onClick={handleClick} onKeyPress={handleKeyPress} tabIndex={tabIndex}>
      <span>{t(tabName)}</span>
    </div>
  );
}

export default Tab;
