const getinitialState = () => {
    if(window.localStorage.getItem('ODStore') == undefined){
        return  {
            name:'OptyDoc',
            version:'0.0.1',
            colorMode:'light',
            languageCode:'en',
            tabSelected:'edit',
            languageWords:{}
            
        }  
      }else{
        console.debug('Getting app data from localstorage')
        return JSON.parse(window.localStorage.getItem('ODStore')).app;
      } 
}
const appReducer = (state = getinitialState(), action)=>{
    switch(action.type){
        case 'colorMode/colormodeSet':
            return {...state,colorMode:action.payload}
        case 'colorMode/colormodeToggle':
            return {...state,colorMode:action.payload}
        case 'menu/tabSet': 
            if(['edit','copy','print'].indexOf(action.payload) > -1)
            return {...state,tabSelected:action.payload}
        default:
            return state
    }
}

export default appReducer;