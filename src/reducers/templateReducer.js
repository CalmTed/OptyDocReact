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
            marginLeft:'0',
            marginRight:'0',
            marginTop:'0',
            marginBottom:'0',
            zoom:100,
            children:[{
                uuid:'123',
                localID:'1',
                parentID:'',
                humanfriendlyID:'block_1',
                valueType:'custom',
                innerText:'inner text here, hello',
                isEditing:false,
                isTextediting:false,
                style:{
                    displayMode:'flex',
                    width:'100mm',
                    height:'100mm'

                }
            }]
        }  
      }else{
        console.debug('Getting app data from localstorage')
        return JSON.parse(window.localStorage.getItem('ODStore')).template;
      } 
}
const templateReducer = (state = getinitialState(), action)=>{
    switch(action.type){
        case 'template/zoomSet':
            //TODO make if functional for scroll
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
        case 'template/marginLeftSet':
            //TODO validate payload
            if(action.payload>=0&&action.payload<1000){
                return {...state,marginLeft:action.payload}
            }
        default:
            return state;
    }
}

export default templateReducer;