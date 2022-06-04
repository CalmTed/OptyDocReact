import actionTypes from './actionTypes';
import langWords from '../langWords';
import { colorModes, TAB_NAMES, tabOptions } from '../constants/constants' 

const getinitialState = () => {
    if(!window.localStorage.getItem('ODStore')){
        return  {
            name:'OptyDoc',
            version:'0.0.1',
            colorMode:colorModes[0] ||'light',
            colorModeOptions:colorModes || [],
            languageCode:'en',
            languageWords:langWords(),
            tabSelected:TAB_NAMES.edit,
            tabSelectedOptions:tabOptions,
            blockSelected:'',
            copySelected:'',
        }  
      }else {
        console.debug('Getting app data from localstorage')
        return JSON.parse(window.localStorage.getItem('ODStore')).app;
      } 
}
const appReducer = (state = getinitialState(), action)=>{
    switch(action.type){
        case actionTypes.COLORMODE_SET:
            return {...state,colorMode:action.payload}

        case actionTypes.COLORMODE_TOGGLE:
            if(! state.colorMode){return 0}
            if(! colorModes){return 0}
            let currentMode = colorModes.find(mode=>mode[1] == state.colorMode)
            let newColorMode = colorModes[colorModes.indexOf(currentMode)+1]?.[1];
            if(! newColorMode){ newColorMode = colorModes[0]?.[1]}
            
            return newColorMode && {...state,colorMode:newColorMode}
        case actionTypes.TAB_SET: 
            if(tabOptions.map(option=>option[1]).indexOf(action.payload) > -1)
            return {...state,tabSelected:action.payload};break;

        case actionTypes.SELECTEDBLOCK_SET:
             
            if(typeof action.payload != 'undefined'){
                return {...state,blockSelected:action.payload}; 
            }else{
                return state;
            }
        case actionTypes.SELECTEDCOPY_SET:
            
            if(typeof action.payload != 'undefined'){
                return {...state,copySelected:action.payload}; 
            }else{
                return state;
            }
        case actionTypes.LANGCODE_TOGGLE:
            //TO DO get lang code from lang data avalible
            if(Object.keys(state.languageWords).length > 0 ){
                //en >> fistKey >> [nextKey] >> en
                const codeIndexNow = Object.keys(state.languageWords).indexOf(state.languageCode);
                const langCodesLength = Object.keys(state.languageWords).length;
                if(langCodesLength>0 && codeIndexNow === -1){
                    return {...state,languageCode:Object.keys(state.languageWords)[0]}
                }else if(codeIndexNow < langCodesLength-1){
                    return {...state,languageCode:Object.keys(state.languageWords)[codeIndexNow+1]}
                }else{
                    return {...state,languageCode:'en'}
                }
            }else{
                return state;
            }
            break;
        default:
            return state
    }
}

export default appReducer;