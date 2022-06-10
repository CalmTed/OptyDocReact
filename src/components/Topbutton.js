import React from "react";
import Icon from "./Icon";
import actionTypes from "../reducers/actionTypes";
import t from "../local.ts";
function Topbutton ({disabled = false, name, store}) {
  const stateNow = store.getState();
  const isDisabled = (name) => {
    switch(name) {
    case "removeBlock":
      if(stateNow.app.blockSelected === "") {
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
    const getCheckSum = (_string = "") => {
      return Math.abs(_string.split("").reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a; }));
    };
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
        blockSelected:blockSelected});
      break;
    case "removeBlock":
      store.dispatch({type:actionTypes.SELECTEDBLOCK_SET,
        payload:""});
      store.dispatch({type:actionTypes.TEMPLATE_BLOCK_REMOVE,
        payload:"",
        blockSelected:blockSelected});
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
          payload:""});
      };
      if(stateNow.template.dateEdited !== "0") {
        if(confirm(t("Delete existing?"))) {
          setNewTemp();
        }
      }else{
        setNewTemp();
      }
      break;
    case "exportTemplate":
      const saveFile = (textToSave, fileName) => {
        let link = document.createElement("a");
        document.body.appendChild(link);
        link.style = "display: none";
        let url = "data:application/json;charset=utf-8,%EF%BB%BF" + encodeURI(textToSave);
        link.href = url;
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(url);
      };
      let fileContent = {...stateNow.template};
      fileContent.version = stateNow.app.version;
      fileContent.checksum = getCheckSum(JSON.stringify(fileContent));
      let fileJSONContent = JSON.stringify(fileContent);
      saveFile(fileJSONContent, stateNow.template.name + ".optydoc");
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
      if(stateNow.template.dateEdited !== "0") {
        if(!confirm(t("Delete existing?"))) {
          return false;
        }
      }
      let file = e.target.files[0];
      let fileText = "";
      let fileReader = new FileReader();
      fileReader.onload = function () {
        fileText = fileReader.result;
        let templateData = JSON.parse(fileText);
        let valid = true;
        //check checksum
        if(templateData.checksum !== getCheckSum(fileText.replace(/,"checksum":\d{1,10}/, ""))) {
          valid = false;
          console.warn("invalid checksum");
        }
        //check version
        if(templateData.version !== stateNow.app.version) {
          valid = false;
          console.warn("invalid version");
        }
        if(valid) {
          store.dispatch({type:actionTypes.TEMPLATE_OPEN_TEMPLATE,
            payload:templateData});
        }else{
          //TO DO info box here
          console.warn("invalid file");
        }
      };
      fileReader.readAsText(file);
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
    <div className={"Topbutton" + " tbtn-" + name + " " + isDisabled(name, store)} tabIndex={!disabled ? "7" : ""} onClick={handleClick} onKeyPress={handleKeyPress} title={t(name)}>
      {getContent(name, stateNow, store)}
    </div>
  );
}

export default Topbutton;
