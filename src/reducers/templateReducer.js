const getinitialState = () => {
    if(window.localStorage.getItem('ODStore') == undefined){
        return  {
            uuid:'000000',
            name:'New template',
            dateCreated:'0',
            dateEdited:'0',
            creator:'man',
            pageSize:'A4',
            pageSizeOptions:[['A4','A4'],['A3','A3']],
            pageOrientation:'portrait',
            pageOrientationOptions:[['Portrait','portrait'],['Landscape','landscape']],
            zoom:100
        }  
      }else{
        console.debug('Getting app data from localstorage')
        return JSON.parse(window.localStorage.getItem('ODStore')).template;
      } 
}
const templateReducer = (state = getinitialState(), action)=>{
    switch(action.type){
        case 'template/zoomSet':
            if(action.payload>=500){
                action.payload=500
            }
            if(action.payload<=1){
                action.payload=1;
            }
            return {...state,zoom:action.payload}
        case 'template/nameSet':
            //TODO check length
            return {...state,name:action.payload}
        case 'template/pageSizeSet':
            //TODO validate payload
            return {...state,pageSize:action.payload}
        case 'template/pageOrientationSet':
            //TODO validate payload
            return {...state,pageOrientation:action.payload}
        default:
            return state
    }
}

export default templateReducer;