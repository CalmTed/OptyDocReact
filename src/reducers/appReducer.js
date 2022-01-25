import actionTypes from './actionTypes';
import langWords from '../langWords';
const getinitialState = () => {
    if(!window.localStorage.getItem('ODStore')){//TO DO for translation development
        return  {
            name:'OptyDoc',
            version:'0.0.1',
            colorMode:'light',
            colorModeOptions:[['Light','light'],['Dark','dark']],
            languageCode:'en',
            languageWords:langWords(),
            tabSelected:'edit',
            tabSelectedOptions:[['Edit','edit'],['Copy','copy'],['Print','print']],
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
            let newColorMode = 'light';
            switch(state.colorMode){
                case 'light':newColorMode = 'dark';break;
                case 'dark':newColorMode = 'light';break;
            }
            return {...state,colorMode:newColorMode}

        case actionTypes.TAB_SET: 
            if(['edit','copy','print'].indexOf(action.payload) > -1)
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