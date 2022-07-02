import React from "react";
import Block from "./Block";
import {BLOCK_NO_PARENT} from "../constants/block";
function CopyStack ({
  store
}) {
  const stateNow = store.getState();
  const fitsOnPage = stateNow.template.fitsH * stateNow.template.fitsW;
  const pagesNeeded = (stateNow.copies.rows.length / fitsOnPage) + 0.001 << 0;
  //TODO get copy style
  const getCopies = (startFrom = 0, perPage = Infinity) => {
    let ret = [];
    stateNow.copies.rows.forEach((row, copyIndex) => {
      if(copyIndex >= startFrom && copyIndex < startFrom + perPage) {
        stateNow.template.children.filter(ch => { return ch.parentID === BLOCK_NO_PARENT; }).forEach(childBlock => {
          ret.push(<Block key={`${childBlock.uuid}_${copyIndex}`} blockData={childBlock} store={store} copyIndex={copyIndex}/>);
        });
      }
    });
    return ret;
  };
  if(fitsOnPage > 0 && pagesNeeded > 1) {
    for(let copyPageIndex = 0; copyPageIndex < pagesNeeded; copyPageIndex++) {
      return <div key={"copyPage" + copyPageIndex} className="PageWrapper"><div className="PageInner">{getCopies(fitsOnPage * copyPageIndex, fitsOnPage)}</div></div>;
    }
  }else{
    return <div key="1" className="PageWrapper"><div className="PageInner">{getCopies()}</div></div>;
  }
}
export default CopyStack;