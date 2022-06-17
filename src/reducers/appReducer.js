import langWords from "../langWords";
import actionTypes from "../constants/actionTypes";
import {colorModes, tabOptions} from "../constants/app"; 
import {initialValuesApp} from "../constants/initialValues";

const getinitialState = () => {
  if(!window.localStorage.getItem("ODStore")) {
    return  {
      languageWords:langWords(),
      ...initialValuesApp
    };  
  }else {
    console.debug("Getting app data from localstorage");
    return JSON.parse(window.localStorage.getItem("ODStore")).app;
  } 
};
const appReducer = (state = getinitialState(), action) => {
  switch(action.type) {
  case actionTypes.COLORMODE_SET:
    return {...state,
      colorMode:action.payload};

  case actionTypes.COLORMODE_TOGGLE:
    if(!state.colorMode) { return false; }
    if(!colorModes) { return false; }
    let currentMode = colorModes.find(mode => mode[1] === state.colorMode);
    let newColorMode = colorModes[colorModes.indexOf(currentMode) + 1]?.[1];
    if(!newColorMode) { newColorMode = colorModes[0]?.[1]; }
            
    return newColorMode && {...state,
      colorMode:newColorMode};
  case actionTypes.TAB_SET: 
    if(tabOptions.map(option => option[1]).includes(action.payload))
    { return {...state,
      tabSelected:action.payload}; }break;

  case actionTypes.SELECTEDBLOCK_SET:
             
    if(typeof action.payload !== "undefined") {
      return {...state,
        blockSelected:action.payload}; 
    }else{
      return state;
    }
  case actionTypes.SELECTEDCOPY_SET:
            
    if(typeof action.payload !== "undefined") {
      return {...state,
        copySelected:action.payload}; 
    }else{
      return state;
    }
  case actionTypes.LANGCODE_TOGGLE:
    //TO DO get lang code from lang data avalible
    if(Object.keys(state.languageWords).length) {
      //en >> fistKey >> [nextKey] >> en
      const codeIndexNow = Object.keys(state.languageWords).indexOf(state.languageCode);
      const langCodesLength = Object.keys(state.languageWords).length;
      if(langCodesLength && codeIndexNow === -1) {
        return {...state,
          languageCode:Object.keys(state.languageWords)[0]};
      }else if(codeIndexNow < langCodesLength - 1) {
        return {...state,
          languageCode:Object.keys(state.languageWords)[codeIndexNow + 1]};
      }else{
        return {...state,
          languageCode:"en"};
      }
    }else{
      return state;
    }
  default:
    return state;
  }
};

export default appReducer;