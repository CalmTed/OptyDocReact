import React from "react";
import Icon from "./Icon";
import t from "../local.ts";
import actionTypes from "../constants/actionTypes";
import {exportTemplateFile, importTemplateFile} from "../utils/handleTemplateFile";
import {recreateCopiesTitles} from "../utils/handleCopyesTable";
import {NO_BLOCK_SELECTED, TAB_INDEXES} from "../constants/app";

function Topbutton ({disabled = false, name, store}) {
  const stateNow = store.getState();
  const isDisabled = (name) => {
    switch(name) {
    case "removeBlock":
      if(stateNow.app.blockSelected === NO_BLOCK_SELECTED) {
        disabled = true;
      }
      break;
    }
    if(disabled) {
      return "disabled";
    }else{
      return "";
    }
  };
  const handleClick = (e) => {
    //TODO check if not disabled
    const blockSelected = stateNow.app.blockSelected;
    
    if(disabled) {
      return false;
    }
    switch(name) {
    case "settings":
      store.dispatch({type:actionTypes.COLORMODE_TOGGLE,
        payload:""});
      break;
    case "newBlock":
      store.dispatch({type:actionTypes.TEMPLATE_NEW_BLOCK_ADD,
        payload:"",
        blockSelected:blockSelected
      });
      break;
    case "removeBlock":
      store.dispatch({
        type:actionTypes.SELECTEDBLOCK_SET,
        payload:NO_BLOCK_SELECTED
      });
      store.dispatch({type:actionTypes.TEMPLATE_BLOCK_REMOVE,
        payload:"",
        blockSelected:blockSelected
      });
      break;
    case "splitBlock":
      store.dispatch({
        type:actionTypes.TEMPLATE_BLOCK_SPLIT,
        blockSelected:blockSelected
      });
      break;
    case "newTemplate":
      const setNewTemp = () => {
        store.dispatch({type:actionTypes.TEMPLATE_NEW_TEMPLATE,
          payload:""});
        store.dispatch({type:actionTypes.COPIES_COLUMNS_SET,
          payload:[]});
        store.dispatch({type:actionTypes.COPIES_DATA_SET,
          payload:[]});
        store.dispatch({type:actionTypes.SELECTEDBLOCK_SET,
          payload:NO_BLOCK_SELECTED});
      };
      if(stateNow.template.dateEdited) {
        if(confirm(t("Delete existing?"))) {
          setNewTemp();
        }
      }else{
        setNewTemp();
      }
      break;
    case "exportTemplate":
      exportTemplateFile(stateNow.template, stateNow.app.version, () => {
        console.log("saved successfully");
      });
      break;
    case "importTemplate":
      if(typeof e.target === "undefined") {
        return false;
      }
      if(typeof e.target.files === "undefined") {
        return false;
      }
      if(typeof e.target.files[0] === "undefined") {
        return false;
      }
      if(stateNow.template.dateEdited) {
        if(!confirm(t("Delete existing?"))) {
          return false;
        }
      }
      importTemplateFile(e.target.files[0], stateNow.app.version, async (templateData) => {
        await store.dispatch({type:actionTypes.TEMPLATE_OPEN_TEMPLATE,
          payload:templateData});
        recreateCopiesTitles(store, actionTypes);
      }, (err) => {
        console.warn(err);
      });
      e.target.value = null;
      break;
    case "language":
      store.dispatch({type:actionTypes.LANGCODE_TOGGLE});
      break;
    }
  };
  const handleTemplateImport = (e) => {
    !disabled ? handleClick(e) : false;
  };
  const handleKeyPress = (e) => {
    e.key === "Enter" ? handleClick() : false;
  };
  const getIcon = (name, stateNow, store) => {
    if(name === "settings") {
      if(stateNow.app.colorMode === "light") {
        return <Icon key={name} image='darkMode' store={store}></Icon>;
      }else{
        return <Icon key={name} image='lightMode' store={store}></Icon>;
      }
    }else{
      return <Icon key={name} image={name} store={store}></Icon>;
    }
  };
  const getContent = (name, stateNow, store) => {
    let content = [];
    if(name === "importTemplate") {
      content.push(<label key={name + "Label"} title={t(name)} >
        <Icon image={name} store={store}/>
        <input key={name + "HiddenInput"} type='file' style={{"display":"none"}} onChange={handleTemplateImport} accept=".optydoc"/>
      </label>);
    }else{
      content.push(getIcon(name, stateNow, store));
    }
    return content;
  };
  return (
    <div className={"Topbutton" + " tbtn-" + name + " " + isDisabled(name, store)} tabIndex={!disabled ? TAB_INDEXES.topButton : ""} onClick={handleClick} onKeyPress={handleKeyPress} title={t(name)}>
      {getContent(name, stateNow, store)}
    </div>
  );
}

export default Topbutton;
