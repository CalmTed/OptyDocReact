import actionTypes from './actionTypes';
const getinitialState = () => {
    if(window.localStorage.getItem('ODStore') == undefined){
        return  {
            name:'OptyDoc',
            version:'0.0.1',
            colorMode:'light',
            colorModeOptions:[['Light','light'],['Dark','dark']],
            languageCode:'en',
            languageWords:{},
            tabSelected:'',
            tabSelectedOptions:[['Edit','edit'],['Copy','copy'],['Print','print']],
            blockSelected:'' 
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
        default:
            return state
    }
}

export default appReducer;