import React from "react";
import Block from "./Block";
import {BLOCK_NO_PARENT} from "../constants/block";
function EditStack ({
  store
}) {
  const stateNow = store.getState();
  const getBlocks = () => {
    let ret = [];
    if(!stateNow.template.children.length) { //no children
      //create inside template
      //for now show nothing
    }else{ //if there`re some children
      //show them
      stateNow.template.children.filter(ch => { return ch.parentID === BLOCK_NO_PARENT; }).forEach(childBlock => {
        ret.push(<Block key={childBlock.uuid} blockData={childBlock} store={store}/>);
      });
    }
    return ret;
  };
  return (
    <div key="1" className="PageWrapper"><div className="PageInner">{getBlocks()}</div></div>
  );
}
export default EditStack;