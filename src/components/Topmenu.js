import React from "react";
import Topbutton from "./Topbutton";
import {TAB_NAMES} from "../constants/constants";

function Topmenu ({store}) {
  const stateNow = store.getState();
  const getTabTools = (stateNow, store) => {
    let ret = [];
    if(stateNow.app.tabSelected === TAB_NAMES.edit) {
      ret.push(<Topbutton key='1' name='newBlock' store={store}></Topbutton>);
      ret.push(<Topbutton key='2' name='removeBlock' store={store}></Topbutton>);
    }
    return ret;
  };
  const getTemplateTools = (stateNow, store) => {
    let ret = [];
    const isExportDisabled = (stateNow) => {
      return stateNow.template.dateEdited === "0" ? {disabled:true} : {};
    };
    ret.push(<Topbutton key='importTemplateButton' name='importTemplate' store={store}></Topbutton>);
    ret.push(<Topbutton key='newTemplateButton' name='newTemplate' store={store}></Topbutton>);
    ret.push(<Topbutton {...isExportDisabled(stateNow)} key='exportTemplateButton' name='exportTemplate' store={store}></Topbutton>);
    return ret;
  };
  const getLangButton = (stateNow, store) => {
    if(Object.keys(stateNow.app.languageWords).length > 0) {
      return <Topbutton name='language' store={store}></Topbutton>;
    }else{
      return <Topbutton disabled name='language' store={store}></Topbutton>;
    }
  };
  return (
    <div className='Topmenu'>
      <div className='templateTools'>
        <Topbutton disabled name='undo' store={store}></Topbutton>
        <Topbutton disabled name='redo' store={store}></Topbutton>  
        {getTabTools(stateNow, store)}
        <Topbutton disabled name='ellipse' store={store}></Topbutton>
        <Topbutton disabled name='ellipse' store={store}></Topbutton>
        <Topbutton disabled name='ellipse' store={store}></Topbutton>
      </div>
      <div className='appTools'>
        {getTemplateTools(stateNow, store)}
        {getLangButton(stateNow, store)}
        <Topbutton name='settings' store={store}></Topbutton>
      </div>
    </div>
  );
}

export default Topmenu;
